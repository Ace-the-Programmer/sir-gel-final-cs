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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, search, location } from 'ionicons/icons';

export interface LocationResult {
  name: string;
  distance: string;
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
  ],
})
export class SearchResultsPage implements OnInit {
  searchQuery: string = 'Araullo University';

  allLocations: LocationResult[] = [
    { name: 'Araullo University', distance: '7.2' },
    { name: 'Aduas Sur', distance: '10.9' },
    { name: 'Aduas Norte', distance: '11.0' },
    { name: 'Aduas Centro', distance: '11.5' },
  ];

  filteredLocations: LocationResult[] = [];

  constructor(private router: Router) {
    addIcons({ chevronBack, search, location });
  }

  ngOnInit() {
    this.filteredLocations = [...this.allLocations];
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.filteredLocations = [...this.allLocations];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredLocations = this.allLocations.filter((loc) =>
      loc.name.toLowerCase().includes(q)
    );
  }

  selectLocation(item: LocationResult) {
    this.router.navigate(['/map'], {
      queryParams: {
        location: item.name,
      },
    });
  }

  onBack() {
    this.router.navigate(['/map']);
  }
}
