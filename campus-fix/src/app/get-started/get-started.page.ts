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
    this.router.navigate(['/welcome'], { queryParams: { step: 0 } });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onContinueGuest() {
    this.router.navigate(['/map']);
  }
}
