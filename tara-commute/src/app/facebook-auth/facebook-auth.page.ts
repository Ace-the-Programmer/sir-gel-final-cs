import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';
import { StudentService, UserAccount } from '../services/student.service';

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
    IonCard,
    IonCardContent,
    IonText,
    IonButton,
    IonIcon,
  ],
})
export class FacebookAuthPage implements OnInit {
  accountName: string = 'Campus Commuter';
  currentUser: UserAccount | null = null;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {
    addIcons({ person });
  }

  ngOnInit() {
    const user = this.studentService.getCurrentUser();
    if (user && user.full_name) {
      this.currentUser = user;
      this.accountName = user.full_name;
    } else {
      this.studentService.getUsers().subscribe({
        next: (res) => {
          if (res && res.success && res.data && res.data.length > 0) {
            this.currentUser = res.data[0];
            this.accountName = res.data[0].full_name;
          }
        },
      });
    }
  }

  onContinue() {
    if (this.currentUser) {
      this.studentService.setCurrentUser(this.currentUser);
    }
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
