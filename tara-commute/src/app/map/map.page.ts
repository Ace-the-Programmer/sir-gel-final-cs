import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonChip,
  IonCheckbox,
  IonText,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, locate, syncOutline, navigate, closeCircle, calculatorOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { StudentService, CampusLocation, FareCalculationResult } from '../services/student.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonChip,
    IonCheckbox,
    IonText,
  ],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  selectedLocation: string = '';
  originLocation: string = '';
  commuteMode: string = 'car';
  destLat?: number;
  destLng?: number;
  currentLat: number = 15.4915;
  currentLng: number = 120.9720;
  isLocating: boolean = false;
  hasLocatedUser: boolean = false;

  // Live Autocomplete from MySQL campus_locations
  allLocations: CampusLocation[] = [];
  filteredLocations: CampusLocation[] = [];
  showSearchDropdown: boolean = false;
  isLoadingLocations: boolean = false;

  // Live Interactive Fare Calculator
  showFareCalculator: boolean = false;
  calcDistance: number = 2.5;
  calcMode: string = 'tricycle';
  applyStudentDiscount: boolean = true;
  fareResult?: FareCalculationResult;
  isLoggingTrip: boolean = false;

  private map?: L.Map;
  private userMarker?: L.Marker;
  private userAccuracyCircle?: L.Circle;
  private destMarker?: L.Marker;
  private routeLine?: L.Polyline;
  private resizeListener?: () => void;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private toastCtrl: ToastController
  ) {
    addIcons({ search, locate, syncOutline, navigate, closeCircle, calculatorOutline });
  }

  ngOnInit() {
    this.loadCampusLocations();

    this.route.queryParams.subscribe((params) => {
      if (params['location']) {
        this.selectedLocation = params['location'];
      }
      if (params['to']) {
        this.selectedLocation = params['to'];
      }
      if (params['from']) {
        this.originLocation = params['from'];
      }
      if (params['mode']) {
        this.commuteMode = params['mode'];
      }
      if (params['destLat'] && params['destLng']) {
        this.destLat = Number(params['destLat']);
        this.destLng = Number(params['destLng']);
      }
      if (this.selectedLocation && this.map) {
        this.addDestinationMarker(this.selectedLocation);
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
        if (this.selectedLocation) {
          this.addDestinationMarker(this.selectedLocation);
        }
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

  loadCampusLocations() {
    this.isLoadingLocations = true;
    this.studentService.getCampusLocations().subscribe({
      next: (res) => {
        this.isLoadingLocations = false;
        if (res && res.success && Array.isArray(res.data)) {
          this.allLocations = res.data;
          this.filteredLocations = [...this.allLocations];

          // If location was selected before locations loaded, resolve coordinates
          if (this.selectedLocation && (!this.destLat || !this.destLng)) {
            const match = this.allLocations.find((l) =>
              l.name.toLowerCase().includes(this.selectedLocation.toLowerCase())
            );
            if (match) {
              this.destLat = Number(match.latitude);
              this.destLng = Number(match.longitude);
              if (this.map) {
                this.addDestinationMarker(this.selectedLocation);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoadingLocations = false;
        console.warn('Fallback default campus locations:', err);
      },
    });
  }

  onSearchInput(event: any) {
    const val = (this.selectedLocation || '').toLowerCase().trim();
    if (!val) {
      this.filteredLocations = [...this.allLocations];
    } else {
      this.filteredLocations = this.allLocations.filter(
        (l) =>
          l.name.toLowerCase().includes(val) ||
          l.category.toLowerCase().includes(val)
      );
    }
    this.showSearchDropdown = true;
  }

  onSearchFocus() {
    this.showSearchDropdown = true;
    if (!this.selectedLocation) {
      this.filteredLocations = [...this.allLocations];
    }
  }

  toggleSearchDropdown() {
    this.showSearchDropdown = !this.showSearchDropdown;
    if (this.showSearchDropdown && this.filteredLocations.length === 0) {
      this.filteredLocations = [...this.allLocations];
    }
  }

  selectDestination(loc: CampusLocation) {
    this.selectedLocation = loc.name;
    this.destLat = Number(loc.latitude);
    this.destLng = Number(loc.longitude);
    this.showSearchDropdown = false;
    this.addDestinationMarker(loc.name);
  }

  onSearchEnter() {
    this.showSearchDropdown = false;
    if (this.filteredLocations.length > 0) {
      this.selectDestination(this.filteredLocations[0]);
    } else if (this.selectedLocation) {
      this.addDestinationMarker(this.selectedLocation);
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
        destination: this.selectedLocation || '',
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
      this.addDestinationMarker(this.selectedLocation);
    }

    if (flyTo) {
      this.map.flyTo([lat, lng], 16.5, { animate: true, duration: 1.2 });
      setTimeout(() => {
        this.userMarker?.openPopup();
      }, 1200);
    } else if (!this.selectedLocation) {
      this.map.setView([lat, lng], 16);
    }
  }

  private addDestinationMarker(name: string) {
    if (!this.map) return;

    // Resolve coordinates from allLocations if not passed explicitly
    if ((!this.destLat || !this.destLng) && this.allLocations.length > 0) {
      const match = this.allLocations.find((l) =>
        l.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) {
        this.destLat = Number(match.latitude);
        this.destLng = Number(match.longitude);
      }
    }

    const destLatLng: [number, number] =
      this.destLat && this.destLng
        ? [this.destLat, this.destLng]
        : [15.4965, 120.976];

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

    const distMeters = this.map.distance([this.currentLat, this.currentLng], destLatLng);
    const distKm = (distMeters / 1000).toFixed(2);

    // Sync with Live Fare Calculator
    this.calcDistance = Number(distKm);
    this.calcMode = this.commuteMode || 'tricycle';
    this.onRecalculateFare();
    this.showFareCalculator = true;

    const popupHtml = `
      <div style="font-family: inherit; padding: 2px;">
        <strong style="color: #0f172a; font-size: 13px;">🎯 ${name}</strong><br>
        <span style="color: #64748b; font-size: 11.5px;">Distance: <strong>${distKm} km</strong></span><br>
        <span style="color: #2563eb; font-weight: 700; font-size: 12px;">Student Fare: ₱${this.fareResult?.studentFare.toFixed(2)}</span>
      </div>
    `;

    if (this.destMarker) {
      this.destMarker.setLatLng(destLatLng);
      this.destMarker.bindPopup(popupHtml);
    } else {
      this.destMarker = L.marker(destLatLng, { icon: destIcon })
        .addTo(this.map)
        .bindPopup(popupHtml);
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

    this.map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] });
    setTimeout(() => {
      this.destMarker?.openPopup();
    }, 600);
  }

  // ==========================================
  // FARE CALCULATOR METHODS
  // ==========================================

  toggleFareCalculator() {
    this.showFareCalculator = !this.showFareCalculator;
    if (this.showFareCalculator && !this.fareResult) {
      this.onRecalculateFare();
    }
  }

  adjustDistance(delta: number) {
    const next = Math.max(0.1, Math.round((this.calcDistance + delta) * 10) / 10);
    this.calcDistance = next;
    this.onRecalculateFare();
  }

  setCalcMode(mode: string) {
    this.calcMode = mode;
    this.commuteMode = mode;
    this.onRecalculateFare();
  }

  toggleStudentDiscount() {
    this.applyStudentDiscount = !this.applyStudentDiscount;
    this.onRecalculateFare();
  }

  onRecalculateFare() {
    this.fareResult = this.studentService.calculateFare(
      this.calcDistance,
      this.calcMode,
      this.applyStudentDiscount
    );
  }

  async logCurrentTrip() {
    const student = this.studentService.getCurrentStudent();
    if (!student || !student.student_no) {
      await this.showToast('Please log in as a student to save this trip to your Commute Pass.', 'warning');
      return;
    }

    if (!this.fareResult) {
      this.onRecalculateFare();
    }

    this.isLoggingTrip = true;
    this.studentService
      .logTrip({
        student_no: student.student_no,
        origin: this.originLocation || 'Current Location',
        destination: this.selectedLocation || 'Campus Hub',
        mode: this.calcMode,
        distance_km: this.fareResult!.distanceKm,
        fare_amount: this.fareResult!.studentFare,
      })
      .subscribe({
        next: async () => {
          this.isLoggingTrip = false;
          await this.showToast(
            `Trip logged! ₱${this.fareResult!.studentFare.toFixed(2)} recorded in your MySQL Commute History.`,
            'success'
          );
        },
        error: async (err) => {
          this.isLoggingTrip = false;
          await this.showToast('Could not save trip to local database.', 'danger');
        },
      });
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
