import { Component, OnInit } from '@angular/core';
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
  IonSpinner,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, arrowBack, chevronBack, personAddOutline } from 'ionicons/icons';
import { StudentService, UserAccount } from '../services/student.service';

export interface DisplayAccount {
  user: UserAccount;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  studentNo: string;
  course: string;
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
    IonSpinner,
  ],
})
export class GoogleAuthPage implements OnInit {
  accounts: DisplayAccount[] = [];
  isLoading: boolean = false;
  private colors = ['#2563eb', '#0284c7', '#059669', '#d97706', '#7c3aed', '#db2777'];

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {
    addIcons({ logoGoogle, arrowBack, chevronBack, personAddOutline });
  }

  ngOnInit() {
    this.loadDatabaseUsers();
  }

  loadDatabaseUsers() {
    this.isLoading = true;
    this.studentService.getUsers().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.success && Array.isArray(res.data)) {
          this.accounts = res.data.map((u, idx) => {
            const initials = u.full_name
              ? u.full_name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'ST';
            return {
              user: u,
              name: u.full_name,
              email: u.email || `${u.username}@campus.edu.ph`,
              avatarColor: this.colors[idx % this.colors.length],
              initials,
              studentNo: u.student_no,
              course: u.course
            };
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load users from MySQL:', err);
      }
    });
  }

  selectAccount(item: DisplayAccount) {
    // Authenticate with chosen database account and proceed directly to Dashboard
    this.studentService.setCurrentUser(item.user);
    this.router.navigate(['/dashboard'], {
      queryParams: {
        user: item.name,
        email: item.email,
        studentNo: item.studentNo,
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/welcome'], { queryParams: { step: 1 } });
  }
}
