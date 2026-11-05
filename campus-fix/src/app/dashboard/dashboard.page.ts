import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
  ],
})
export class DashboardPage {
  constructor(private router: Router) {
    addIcons({ search });
  }

  goToLocation() {
    this.router.navigate(['/location-search']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  onHomeClick() {
    // Already on Home
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }
}

