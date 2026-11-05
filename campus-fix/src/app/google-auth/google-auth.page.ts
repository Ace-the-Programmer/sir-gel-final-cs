import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, arrowBack, chevronBack } from 'ionicons/icons';

export interface GoogleAccount {
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
}

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.page.html',
  styleUrls: ['./google-auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonIcon,
  ],
})
export class GoogleAuthPage {
  accounts: GoogleAccount[] = [
    {
      name: 'Seigi Pascual',
      email: 'seigipascual09@gmail.com',
      avatarColor: '#f28b82',
      initials: 'SP',
    },
    {
      name: 'Queenie Dapooh',
      email: 'queeniedapooh@gmail.com',
      avatarColor: '#f48fb1',
      initials: 'QD',
    },
    {
      name: 'Michel Jordan',
      email: 'michelljordan23ail@gmail.com',
      avatarColor: '#81c784',
      initials: 'MJ',
    },
    {
      name: 'Sam Sulek',
      email: 'samsulekk69@gmail.com',
      avatarColor: '#64b5f6',
      initials: 'SS',
    },
  ];

  constructor(private router: Router) {
    addIcons({ logoGoogle, arrowBack, chevronBack });
  }

  selectAccount(account: GoogleAccount) {
    // Authenticate with chosen Google account and proceed directly to Dashboard
    this.router.navigate(['/dashboard'], {
      queryParams: {
        user: account.name,
        email: account.email,
      },
    });
  }
}
