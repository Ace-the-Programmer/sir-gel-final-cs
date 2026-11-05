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
import { search, locate, syncOutline, navigate } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
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
  currentLat: number = 15.4915;
  currentLng: number = 120.9720;
  isLocating: boolean = false;
  hasLocatedUser: boolean = false;

  private map?: L.Map;
  private userMarker?: L.Marker;
  private userAccuracyCircle?: L.Circle;
  private destMarker?: L.Marker;
  private routeLine?: L.Polyline;
  private resizeListener?: () => void;

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ search, locate, syncOutline, navigate });
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
    }, 150);

    this.resizeListener = () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      } else {
        this.initMap();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  openSearch() {
    this.router.navigate(['/search-results']);
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToRoutePlanner() {
    this.router.navigate(['/location-search'], {
      queryParams: {
        startLocation: this.hasLocatedUser
          ? `My Location (${this.currentLat.toFixed(4)}, ${this.currentLng.toFixed(4)})`
          : 'Current Location',
      },
    });
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }

  private initMap(): void {
    const container = document.getElementById('map-container');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    // Default center Cabanatuan City (Araullo University area)
    const initialCenter: L.LatLngExpression = [this.currentLat, this.currentLng];

    this.map = L.map('map-container', {
      center: initialCenter,
      zoom: 15.5,
      zoomControl: false,
    });

    // OpenStreetMap high-resolution tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Initial resize trigger
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);

    // Automatically trigger GPS Geolocation to find live coordinates
    this.getCurrentLocation(false);
  }

  async getCurrentLocation(flyTo: boolean = true) {
    this.isLocating = true;
    try {
      // 1. Try Capacitor Geolocation API
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      this.currentLat = pos.coords.latitude;
      this.currentLng = pos.coords.longitude;
      this.hasLocatedUser = true;
      this.updateUserMarker(this.currentLat, this.currentLng, pos.coords.accuracy, flyTo);
    } catch (capErr) {
      console.warn('Capacitor Geolocation fallback to browser API:', capErr);
      // 2. Fallback to HTML5 browser Geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.currentLat = pos.coords.latitude;
            this.currentLng = pos.coords.longitude;
            this.hasLocatedUser = true;
            this.updateUserMarker(this.currentLat, this.currentLng, pos.coords.accuracy, flyTo);
            this.isLocating = false;
          },
          (err) => {
            console.warn('Geolocation permission denied or unavailable:', err);
            this.updateUserMarker(this.currentLat, this.currentLng, 50, flyTo);
            this.isLocating = false;
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      } else {
        this.updateUserMarker(this.currentLat, this.currentLng, 50, flyTo);
      }
    } finally {
      this.isLocating = false;
    }
  }

  private updateUserMarker(lat: number, lng: number, accuracy?: number, flyTo: boolean = false) {
    if (!this.map) return;

    // Custom pulsing GPS live location pin
    const pulseIcon = L.divIcon({
      className: 'user-gps-pulse-marker',
      html: `
        <div class="gps-dot-outer">
          <div class="gps-dot-pulse"></div>
          <div class="gps-dot-core"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lng]);
    } else {
      this.userMarker = L.marker([lat, lng], { icon: pulseIcon })
        .addTo(this.map)
        .bindPopup(`<strong>📍 Your Real Location</strong><br><small>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</small>`);
    }

    if (accuracy && accuracy < 400) {
      if (this.userAccuracyCircle) {
        this.userAccuracyCircle.setLatLng([lat, lng]);
        this.userAccuracyCircle.setRadius(accuracy);
      } else {
        this.userAccuracyCircle = L.circle([lat, lng], {
          radius: accuracy,
          color: '#2563eb',
          fillColor: '#60a5fa',
          fillOpacity: 0.15,
          weight: 1.5,
        }).addTo(this.map);
      }
    }

    if (this.selectedLocation) {
      // If a location is searched, place destination marker
      this.addDestinationMarker(this.selectedLocation);
    }

    if (flyTo) {
      this.map.flyTo([lat, lng], 16.5, { animate: true, duration: 1.2 });
      setTimeout(() => {
        this.userMarker?.openPopup();
      }, 1200);
    } else {
      this.map.setView([lat, lng], 16);
    }
  }

  private addDestinationMarker(name: string) {
    if (!this.map) return;
    // Destination point near Araullo University for Cabanatuan demo
    const destLatLng: [number, number] = [15.4965, 120.9760];

    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div class="dest-pin-box">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#dc2626">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    if (this.destMarker) {
      this.destMarker.setLatLng(destLatLng);
    } else {
      this.destMarker = L.marker(destLatLng, { icon: destIcon })
        .addTo(this.map)
        .bindPopup(`<strong>🎯 ${name}</strong>`);
    }

    // Connect with route line
    const latlngs: [number, number][] = [
      [this.currentLat, this.currentLng],
      [destLatLng[0], destLatLng[1]],
    ];

    if (this.routeLine) {
      this.routeLine.setLatLngs(latlngs);
    } else {
      this.routeLine = L.polyline(latlngs, {
        color: '#1d4ed8',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(this.map);
    }

    this.map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
  }
}
