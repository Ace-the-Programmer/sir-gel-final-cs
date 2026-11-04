import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowRedo,
  partlySunny,
  sunny,
  search,
  navigate,
  locationOutline,
} from 'ionicons/icons';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
  ],
})
export class MapPage implements AfterViewInit, OnDestroy {
  private map?: L.Map;
  private resizeListener?: () => void;

  constructor(private router: Router) {
    addIcons({
      arrowRedo,
      partlySunny,
      sunny,
      search,
      navigate,
      locationOutline,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 200);

    // Re-adjust map tile dimensions when resizing or toggling inspect mobile view
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

  private initMap(): void {
    const container = document.getElementById('map-container');
    if (!container) return;

    // Cabanatuan / Wesleyan University coordinates
    const centerLatLng: L.LatLngExpression = [15.4865, 120.9734];

    this.map = L.map('map-container', {
      center: centerLatLng,
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Route coordinates
    const routeCoords: L.LatLngExpression[] = [
      [15.4940, 120.9720],
      [15.4910, 120.9750],
      [15.4880, 120.9730],
      [15.4830, 120.9710],
      [15.4820, 120.9760],
    ];

    // Navigation polyline
    L.polyline(routeCoords, {
      color: '#0099ff',
      weight: 6,
      opacity: 0.85,
    }).addTo(this.map);

    // Origin marker
    L.circleMarker([15.4940, 120.9720], {
      radius: 8,
      fillColor: '#38b6ff',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1,
    }).addTo(this.map);

    // Destination marker
    L.circleMarker([15.4820, 120.9760], {
      radius: 10,
      fillColor: '#ffb247',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1,
    }).addTo(this.map);

    // Invalidate size once tiles load
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 300);
  }
}
