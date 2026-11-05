import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonImg,
  IonButton,
  IonIcon,
  IonText,
  IonList,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonImg,
    IonButton,
    IonIcon,
    IonText,
    IonList,
    IonCard,
    IonCardContent,
  ],
})
export class ProfilePage {
  selectedCard: number = -1;

  constructor(private router: Router) {
    addIcons({ pencil, logOutOutline });
  }

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
