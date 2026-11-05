import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
  ],
})
export class ProfilePage {
  selectedCard: number = -1;

  constructor(private router: Router) {}

  selectHistory(index: number) {
    this.selectedCard = this.selectedCard === index ? -1 : index;
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  goToRoute() {
    this.router.navigate(['/location-search']);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}

