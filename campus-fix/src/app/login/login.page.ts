import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
  ],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  onBack() {
    this.router.navigate(['/get-started']);
  }

  onLogin() {
    // Navigate to dashboard upon successful login
    this.router.navigate(['/dashboard']);
  }

  goToGoogleAuth() {
    this.router.navigate(['/google-auth']);
  }

  goToFacebookAuth() {
    this.router.navigate(['/facebook-auth']);
  }
}

