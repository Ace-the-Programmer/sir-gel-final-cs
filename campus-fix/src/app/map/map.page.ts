import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonText,
  ],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  selectedLocation: string = '';
  private map?: L.Map;
  private resizeListener?: () => void;

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ search });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['location']) {
        this.selectedLocation = params['location'];
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 200);

    this.resizeListener = () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  openSearch() {
    this.router.navigate(['/search-results']);
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToRoutePlanner() {
    this.router.navigate(['/location-search']);
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }

  private initMap(): void {
    const container = document.getElementById('map-container');
    if (!container) return;

    // Center Cabanatuan / Araullo University coordinates (matches screenshot)
    const centerLatLng: L.LatLngExpression = [15.4915, 120.9720];

    this.map = L.map('map-container', {
      center: centerLatLng,
      zoom: 15.5,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }
}
