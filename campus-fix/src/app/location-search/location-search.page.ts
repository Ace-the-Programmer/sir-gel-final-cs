import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonButton,
  IonImg,
  IonText,
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.page.html',
  styleUrls: ['./location-search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    IonButton,
    IonImg,
    IonText,
  ],
})
export class LocationSearchPage implements OnInit {
  startLocation: string = '';
  destination: string = '';
  selectedMode: string = 'car';
  isLocating: boolean = false;
  currentLat?: number;
  currentLng?: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['destination']) {
        this.destination = params['destination'];
      }
      if (params['startLocation']) {
        this.startLocation = params['startLocation'];
      } else {
        // Auto-fetch current geolocation for start location
        this.useCurrentLocation();
      }
    });
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
  }

  async useCurrentLocation() {
    this.isLocating = true;
    this.startLocation = 'Locating GPS...';

    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
      });
      this.currentLat = pos.coords.latitude;
      this.currentLng = pos.coords.longitude;
      this.startLocation = `Current Location (${this.currentLat.toFixed(4)}, ${this.currentLng.toFixed(4)})`;
    } catch (e) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.currentLat = pos.coords.latitude;
            this.currentLng = pos.coords.longitude;
            this.startLocation = `Current Location (${this.currentLat.toFixed(4)}, ${this.currentLng.toFixed(4)})`;
            this.isLocating = false;
          },
          () => {
            this.startLocation = 'Current Location (Araullo Univ, Cabanatuan)';
            this.currentLat = 15.4915;
            this.currentLng = 120.9720;
            this.isLocating = false;
          }
        );
        return;
      }
      this.startLocation = 'Current Location (Araullo Univ, Cabanatuan)';
      this.currentLat = 15.4915;
      this.currentLng = 120.9720;
    } finally {
      this.isLocating = false;
    }
  }

  onEstimate() {
    this.router.navigate(['/map'], {
      queryParams: {
        from: this.startLocation || 'Current Location',
        to: this.destination || 'Araullo University',
        mode: this.selectedMode,
        location: this.destination || 'Araullo University',
      },
    });
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }
}
