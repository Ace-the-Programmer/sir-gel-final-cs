import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonImg,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonImg,
    IonButton,
    IonIcon,
  ],
})
export class GetStartedPage {
  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  onGetStarted() {
    this.router.navigate(['/welcome']);
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onContinueGuest() {
    this.router.navigate(['/dashboard']);
  }
}
