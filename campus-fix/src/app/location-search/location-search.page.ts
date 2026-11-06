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
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { location, search, closeCircle, navigate } from 'ionicons/icons';
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
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    IonButton,
    IonImg,
    IonText,
    IonSpinner,
  ],
})
export class LocationSearchPage implements OnInit {
  startLocation: string = '';
  destination: string = '';
  selectedMode: string = 'car';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
    addIcons({ location, search, closeCircle, navigate });
  }

  ngOnInit() {
    this.loadCampusLocations();

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

  // Load locations from MySQL backend
  loadCampusLocations() {
    this.isLoadingLocations = true;
    this.studentService.getCampusLocations().subscribe({
      next: (res) => {
        this.isLoadingLocations = false;
        if (res && res.success && Array.isArray(res.data)) {
          this.allLocations = res.data;
          this.filteredLocations = [...this.allLocations];
        }
      },
      error: (err) => {
        this.isLoadingLocations = false;
        console.warn('Fallback default locations:', err);
        this.allLocations = [
          { id: 1, name: 'Araullo University (Main Campus)', category: 'Campus', latitude: 15.4915, longitude: 120.972, distance_km: 0 },
          { id: 2, name: 'Sumacab Campus', category: 'Campus', latitude: 15.474, longitude: 120.957, distance_km: 2.5 },
          { id: 3, name: 'SM City Cabanatuan', category: 'Mall', latitude: 15.4785, longitude: 120.9592, distance_km: 3.2 },
          { id: 4, name: 'Pacific Mall Cabanatuan', category: 'Mall', latitude: 15.488, longitude: 120.968, distance_km: 1.8 },
          { id: 5, name: 'NE Pacific Mall', category: 'Mall', latitude: 15.4935, longitude: 120.975, distance_km: 2.3 },
          { id: 6, name: 'Cabanatuan Central Transport Terminal', category: 'Terminal', latitude: 15.485, longitude: 120.963, distance_km: 4.1 },
        ];
        this.filteredLocations = [...this.allLocations];
      }
    });
  }

  onDestinationInput(event: any) {
    const val = (this.destination || '').toLowerCase().trim();
    if (!val) {
      this.filteredLocations = [...this.allLocations];
    } else {
      this.filteredLocations = this.allLocations.filter((loc) =>
        loc.name.toLowerCase().includes(val) || loc.category.toLowerCase().includes(val)
      );
    }
    this.showSuggestions = true;
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

  useCustomSearch() {
    this.showSuggestions = false;
    this.onEstimate();
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateFarePreview();
  }

  updateFarePreview() {
    const dist = Number(this.selectedDestinationLocation?.distance_km) || 2.5;
    this.farePreview = this.studentService.calculateFare(dist, this.selectedMode, true);
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
            this.currentLng = 120.972;
            this.isLocating = false;
          }
        );
        return;
      }
      this.startLocation = 'Current Location (Araullo Univ, Cabanatuan)';
      this.currentLat = 15.4915;
      this.currentLng = 120.972;
    } finally {
      this.isLocating = false;
    }
  }

  onEstimate() {
    this.showSuggestions = false;
    const dest = this.destination.trim() || 'Araullo University';

    // Match destination with location coordinates if available
    let destLat: any = 15.4965;
    let destLng: any = 120.976;
    let distKm: any = 2.5;

    const matched = this.allLocations.find(
      (l) => l.name.toLowerCase() === dest.toLowerCase()
    ) || this.selectedDestinationLocation;

    if (matched) {
      destLat = matched.latitude;
      destLng = matched.longitude;
      distKm = matched.distance_km;
    }

    this.router.navigate(['/map'], {
      queryParams: {
        from: this.startLocation || 'Current Location',
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
