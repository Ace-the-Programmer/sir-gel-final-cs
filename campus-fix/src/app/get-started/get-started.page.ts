import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonImg,
    IonButton,
  ],
})
export class GetStartedPage {
  constructor(private router: Router) {}

  onGetStarted() {
    this.router.navigate(['/google-auth']);
  }

  onLogin() {
    this.router.navigate(['/google-auth']);
  }

  onContinueGuest() {
    this.router.navigate(['/map']);
  }
}
