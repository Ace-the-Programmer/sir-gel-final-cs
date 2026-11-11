import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonImg,
  IonSpinner,
  ToastController,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logInOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonImg,
    IonSpinner,
  ],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBackOutline, logInOutline, eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onBack() {
    this.router.navigate(['/get-started']);
  }

  // Client-side Form Constraint Validation
  validateLoginForm(): string | null {
    const uname = this.username.trim();
    const pwd = this.password.trim();

    if (!uname) {
      return 'Please enter your username or student ID.';
    }
    if (uname.length < 3) {
      return 'Username must be at least 3 characters long.';
    }
    if (uname.length > 50) {
      return 'Username cannot exceed 50 characters.';
    }
    if (!pwd) {
      return 'Please enter your password.';
    }
    if (pwd.length < 4) {
      return 'Password must be at least 4 characters long.';
    }
    return null;
  }

  async onLogin() {
    const errorMsg = this.validateLoginForm();
    if (errorMsg) {
      await this.showToast(errorMsg, 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Verifying credentials with database...',
      spinner: 'crescent'
    });
    await loader.present();
    this.isLoading = true;

    this.studentService.login({
      username: this.username.trim(),
      password: this.password.trim()
    }).subscribe({
      next: async (response) => {
        await loader.dismiss();
        this.isLoading = false;
        if (response && response.success && response.data) {
          await this.showToast(`Welcome back, ${response.data.full_name}!`, 'success');
          this.router.navigate(['/dashboard'], {
            queryParams: {
              user: response.data.full_name,
              studentNo: response.data.student_no
            }
          });
        } else {
          await this.showToast(response.message || 'Login failed. Please verify credentials.', 'danger');
        }
      },
      error: async (err) => {
        await loader.dismiss();
        this.isLoading = false;
        let msg = err?.error?.message;
        if (!msg) {
          if (!err.status || err.status === 0) {
            msg = 'Cannot reach database server. Please check your internet connection or server status.';
          } else {
            msg = 'Invalid username or password. Please check your credentials.';
          }
        }
        await this.showToast(msg, 'danger');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/welcome']);
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
