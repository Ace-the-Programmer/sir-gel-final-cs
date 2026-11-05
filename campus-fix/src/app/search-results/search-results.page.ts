import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

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
    IonContent,
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

  constructor(private router: Router) {}

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
    // Navigate to map centered on the selected location
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

