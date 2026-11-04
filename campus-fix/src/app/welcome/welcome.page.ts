import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  search,
  calendarOutline,
  arrowBackOutline,
  arrowBack,
  chevronBack,
  logoGoogle,
  logoFacebook,
} from 'ionicons/icons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
  ],
})
export class WelcomePage implements OnInit {
  // Step 0: Choose Google/Facebook (media_1793796012329_ae6668c2.jpg)
  // Step 1: Create your username (media_1793796971600_2d0e1a84.jpg)
  // Step 2: Create your password (media_1793796978090_195ca042.jpg)
  // Step 3: Birthday (media_1793796991948_2b2aefca.jpg)
  step: number = 1;

  username: string = '';
  password: string = '';
  birthday: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({
      search,
      calendarOutline,
      arrowBackOutline,
      arrowBack,
      chevronBack,
      logoGoogle,
      logoFacebook,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['step'] !== undefined) {
        this.step = Number(params['step']);
      }
      if (params['name']) {
        this.username = params['name'];
      }
    });
  }

  onNext() {
    if (this.step === 1) {
      this.step = 2; // Proceed to password
    } else if (this.step === 2) {
      this.step = 3; // Proceed to birthday
    } else if (this.step === 3) {
      this.goToMap(); // Finished setup -> Go to Map
    }
  }

  onBack() {
    if (this.step === 3) {
      this.step = 2;
    } else if (this.step === 2) {
      this.step = 1;
    } else if (this.step === 1) {
      this.router.navigate(['/google-auth']);
    } else {
      this.router.navigate(['/get-started']);
    }
  }

  goToGoogleAuth() {
    this.router.navigate(['/google-auth']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }
}
