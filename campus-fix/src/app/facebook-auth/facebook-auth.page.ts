import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-facebook-auth',
  templateUrl: './facebook-auth.page.html',
  styleUrls: ['./facebook-auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class FacebookAuthPage {
  accountName: string = 'Quenie Dapooh';

  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        name: this.accountName,
        provider: 'facebook',
      },
    });
  }

  onCancel() {
    this.router.navigate(['/welcome'], {
      queryParams: { step: 0 },
    });
  }
}

