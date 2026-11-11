import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  location,
  search,
  closeCircle,
  navigate,
  arrowBackOutline,
  schoolOutline,
  navigateOutline,
  pricetagOutline,
  timeOutline,
  checkmarkCircleOutline,
  homeOutline,
  mapOutline,
  personOutline,
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { StudentService, CampusLocation, FareCalculationResult } from '../services/student.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.page.html',
  styleUrls: ['./location-search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonSpinner,
  ],
})
export class LocationSearchPage implements OnInit {
  startLocation: string = '';
  destination: string = '';
  selectedMode: string = 'jeep';
  isLocating: boolean = false;
  currentLat?: number;
  currentLng?: number;

  // Search & Autocomplete from MySQL campus_locations
  allLocations: CampusLocation[] = [];
  filteredLocations: CampusLocation[] = [];
  showSuggestions: boolean = false;
  isLoadingLocations: boolean = false;
  selectedDestinationLocation?: CampusLocation;
  farePreview?: FareCalculationResult;

  // Popular campus hubs for quick 1-tap selection
  popularHubs: Array<{ name: string; category: string; distance_km: number; icon: string }> = [
    { name: 'NEUST Sumacab Campus', category: 'Main Campus', distance_km: 2.5, icon: '🏫' },
    { name: 'Araullo University (Main Campus)', category: 'University', distance_km: 1.8, icon: '🎓' },
    { name: 'Wesleyan University - Philippines', category: 'Campus', distance_km: 3.8, icon: '🏛️' },
    { name: 'SM City Cabanatuan', category: 'Transit Hub / Mall', distance_km: 3.2, icon: '🛍️' },
    { name: 'Central Transport Terminal', category: 'Jeep & Bus Terminal', distance_km: 4.1, icon: '🚌' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
    addIcons({
      location,
      search,
      closeCircle,
      navigate,
      arrowBackOutline,
      schoolOutline,
      navigateOutline,
      pricetagOutline,
      timeOutline,
      checkmarkCircleOutline,
      homeOutline,
      mapOutline,
      personOutline,
    });
  }

  ngOnInit() {
    // 1. Initial calculation so fare preview is NEVER blank
    this.updateFarePreview();

    // 2. Load locations from MySQL backend
    this.loadCampusLocations();

    // 3. Listen to query params
    this.route.queryParams.subscribe((params) => {
      if (params['destination']) {
        this.destination = params['destination'];
      } else if (!this.destination) {
        this.destination = 'Araullo University (Main Campus)';
      }

      if (params['mode']) {
        this.selectedMode = params['mode'];
      }

      if (params['startLocation']) {
        this.startLocation = params['startLocation'];
      } else {
        this.useCurrentLocation();
      }

      this.syncSelectedLocation();
      this.updateFarePreview();
    });
  }

  // Load locations from MySQL backend
  loadCampusLocations() {
    this.isLoadingLocations = true;
    this.studentService.getCampusLocations().subscribe({
      next: (res) => {
        this.isLoadingLocations = false;
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          this.allLocations = res.data;
        } else {
          this.fallbackLocations();
        }
        this.filteredLocations = [...this.allLocations];
        this.syncSelectedLocation();
        this.updateFarePreview();
      },
      error: (err) => {
        this.isLoadingLocations = false;
        console.warn('Using default fallback campus locations:', err);
        this.fallbackLocations();
        this.filteredLocations = [...this.allLocations];
        this.syncSelectedLocation();
        this.updateFarePreview();
      },
    });
  }

  private fallbackLocations() {
    this.allLocations = [
      { id: 1, name: 'Araullo University (Main Campus)', category: 'Campus', latitude: 15.4915, longitude: 120.972, distance_km: 1.8 },
      { id: 2, name: 'NEUST Sumacab Campus', category: 'Campus', latitude: 15.474, longitude: 120.957, distance_km: 2.5 },
      { id: 3, name: 'SM City Cabanatuan', category: 'Mall / Terminal', latitude: 15.4785, longitude: 120.9592, distance_km: 3.2 },
      { id: 4, name: 'Pacific Mall Cabanatuan', category: 'Mall', latitude: 15.488, longitude: 120.968, distance_km: 2.1 },
      { id: 5, name: 'Wesleyan University - Philippines', category: 'Campus', latitude: 15.4935, longitude: 120.975, distance_km: 3.8 },
      { id: 6, name: 'Cabanatuan Central Transport Terminal', category: 'Terminal', latitude: 15.485, longitude: 120.963, distance_km: 4.1 },
    ];
  }

  syncSelectedLocation() {
    if (!this.destination) return;
    const match = this.allLocations.find(
      (l) => l.name.toLowerCase().includes(this.destination.toLowerCase()) ||
             this.destination.toLowerCase().includes(l.name.toLowerCase())
    );
    if (match) {
      this.selectedDestinationLocation = match;
    }
  }

  onDestinationInput(event: any) {
    const val = (this.destination || '').toLowerCase().trim();
    if (!val) {
      this.filteredLocations = [...this.allLocations];
    } else {
      this.filteredLocations = this.allLocations.filter(
        (loc) => loc.name.toLowerCase().includes(val) || loc.category.toLowerCase().includes(val)
      );
    }
    this.showSuggestions = true;
    this.syncSelectedLocation();
    this.updateFarePreview();
  }

  onDestinationFocus() {
    this.showSuggestions = true;
    if (!this.destination) {
      this.filteredLocations = [...this.allLocations];
    }
  }

  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions;
    if (this.showSuggestions && this.filteredLocations.length === 0) {
      this.filteredLocations = [...this.allLocations];
    }
  }

  selectLocation(loc: CampusLocation) {
    this.destination = loc.name;
    this.selectedDestinationLocation = loc;
    this.showSuggestions = false;
    this.updateFarePreview();
  }

  selectQuickHub(hub: { name: string; distance_km: number }) {
    this.destination = hub.name;
    const match = this.allLocations.find((l) => l.name === hub.name);
    if (match) {
      this.selectedDestinationLocation = match;
    } else {
      this.selectedDestinationLocation = {
        id: 99,
        name: hub.name,
        category: 'Campus',
        latitude: 15.485,
        longitude: 120.965,
        distance_km: hub.distance_km,
      };
    }
    this.showSuggestions = false;
    this.updateFarePreview();
  }

  useCustomSearch() {
    this.showSuggestions = false;
    this.updateFarePreview();
    this.onEstimate();
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateFarePreview();
  }

  updateFarePreview() {
    let dist = 2.5;
    if (this.selectedDestinationLocation && this.selectedDestinationLocation.distance_km && Number(this.selectedDestinationLocation.distance_km) > 0) {
      dist = Number(this.selectedDestinationLocation.distance_km);
    } else if (this.destination) {
      const match = this.allLocations.find(
        (l) => l.name.toLowerCase().includes(this.destination.toLowerCase()) ||
               this.destination.toLowerCase().includes(l.name.toLowerCase())
      );
      if (match && match.distance_km && Number(match.distance_km) > 0) {
        dist = Number(match.distance_km);
      }
    }
    this.farePreview = this.studentService.calculateFare(dist, this.selectedMode, true);
  }

  async useCurrentLocation() {
    this.isLocating = true;
    this.startLocation = 'Locating GPS...';

    try {
      await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 4000,
      }).catch(() => null);
    } catch {
      // ignore
    } finally {
      // Privacy Protection: Mask exact residential coordinates with Cabanatuan Campus Transit Hub
      this.currentLat = 15.4858;
      this.currentLng = 120.9672;
      this.startLocation = 'Current Location (Cabanatuan City)';
      this.isLocating = false;
      this.updateFarePreview();
    }
  }

  onEstimate() {
    this.showSuggestions = false;
    const dest = this.destination.trim() || 'NEUST Sumacab Campus';

    let destLat: any = 15.474;
    let destLng: any = 120.957;
    let distKm: any = this.farePreview?.distanceKm || 2.5;

    const matched = this.allLocations.find(
      (l) => l.name.toLowerCase() === dest.toLowerCase()
    ) || this.selectedDestinationLocation;

    if (matched) {
      destLat = matched.latitude;
      destLng = matched.longitude;
      distKm = matched.distance_km || distKm;
    }

    this.router.navigate(['/map'], {
      queryParams: {
        from: this.startLocation || 'Current Location (Cabanatuan City)',
        to: dest,
        mode: this.selectedMode,
        location: dest,
        destLat: destLat,
        destLng: destLng,
        distance: distKm,
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
