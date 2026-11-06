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
import { arrowBackOutline, logInOutline } from 'ionicons/icons';
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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBackOutline, logInOutline });
  }

  onBack() {
    this.router.navigate(['/get-started']);
  }

  async onLogin() {
    if (!this.username.trim()) {
      await this.showToast('Please enter your username or student number', 'warning');
      return;
    }
    if (!this.password.trim()) {
      await this.showToast('Please enter your password', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Authenticating with local database...',
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
        const msg = err?.error?.message || 'Login failed. Check your username/password or XAMPP MySQL.';
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
