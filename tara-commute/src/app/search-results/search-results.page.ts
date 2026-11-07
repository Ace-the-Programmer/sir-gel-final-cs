import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonInput,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, search, location } from 'ionicons/icons';
import { StudentService } from '../services/student.service';

export interface LocationResult {
  name: string;
  distance: string;
  category?: string;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonInput,
    IonText,
    IonSpinner,
  ],
})
export class SearchResultsPage implements OnInit {
  searchQuery: string = '';
  allLocations: LocationResult[] = [];
  filteredLocations: LocationResult[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {
    addIcons({ chevronBack, search, location });
  }

  ngOnInit() {
    this.loadCampusLocations();
  }

  loadCampusLocations() {
    this.isLoading = true;
    this.studentService.getCampusLocations().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.success && Array.isArray(res.data)) {
          this.allLocations = res.data.map((loc) => ({
            name: loc.name,
            distance: String(loc.distance_km),
            category: loc.category,
            latitude: Number(loc.latitude),
            longitude: Number(loc.longitude),
          }));
          this.filteredLocations = [...this.allLocations];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.warn('Could not fetch locations from MySQL, using defaults:', err);
        this.allLocations = [
          { name: 'Araullo University (Main Campus)', distance: '0.0', category: 'Campus', latitude: 15.4915, longitude: 120.972 },
          { name: 'Sumacab Campus', distance: '2.5', category: 'Campus', latitude: 15.474, longitude: 120.957 },
          { name: 'SM City Cabanatuan', distance: '3.2', category: 'Mall', latitude: 15.4785, longitude: 120.9592 },
          { name: 'Pacific Mall Cabanatuan', distance: '1.8', category: 'Mall', latitude: 15.488, longitude: 120.968 },
          { name: 'NE Pacific Mall', distance: '2.3', category: 'Mall', latitude: 15.4935, longitude: 120.975 },
          { name: 'Cabanatuan Central Transport Terminal', distance: '4.1', category: 'Terminal', latitude: 15.485, longitude: 120.963 },
          { name: 'SM Mega Center Cabanatuan', distance: '6.1', category: 'Mall', latitude: 15.486, longitude: 120.967 },
          { name: 'Santa Rosa Junction', distance: '3.4', category: 'Transit Hub', latitude: 15.42, longitude: 120.938 },
        ];
        this.filteredLocations = [...this.allLocations];
      },
    });
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.filteredLocations = [...this.allLocations];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredLocations = this.allLocations.filter((loc) =>
      loc.name.toLowerCase().includes(q) || (loc.category && loc.category.toLowerCase().includes(q))
    );
  }

  selectLocation(item: LocationResult) {
    this.router.navigate(['/map'], {
      queryParams: {
        location: item.name,
        destLat: item.latitude,
        destLng: item.longitude,
        distance: item.distance,
      },
    });
  }

  onBack() {
    this.router.navigate(['/map']);
  }
}
