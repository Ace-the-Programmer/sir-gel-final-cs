import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
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
