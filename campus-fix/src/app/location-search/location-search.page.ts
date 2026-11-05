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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['destination']) {
        this.destination = params['destination'];
      }
      if (params['startLocation']) {
        this.startLocation = params['startLocation'];
      }
    });
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
  }

  useCurrentLocation() {
    this.startLocation = 'Current Location';
  }

  onEstimate() {
    this.router.navigate(['/map'], {
      queryParams: {
        from: this.startLocation || 'Current Location',
        to: this.destination || 'Destination Point',
        mode: this.selectedMode,
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
