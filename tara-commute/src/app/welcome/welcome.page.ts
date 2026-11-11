import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonText,
  IonButton,
  IonIcon,
  IonInput,
  IonImg,
  IonSpinner,
  ToastController,
  LoadingController,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  arrowBackOutline,
  schoolOutline,
  personOutline,
  personCircleOutline,
  idCardOutline,
  lockClosedOutline,
  checkmarkCircleOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { StudentService, UserAccount } from '../services/student.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonText,
    IonButton,
    IonIcon,
    IonInput,
    IonImg,
    IonSpinner,
    IonSelect,
    IonSelectOption,
  ],
})
export class WelcomePage implements OnInit {
  username: string = '';
  fullName: string = '';
  school: string = 'NEUST';
  customSchool: string = '';
  password: string = '';
  showPassword: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      calendarOutline,
      arrowBackOutline,
      schoolOutline,
      personOutline,
      personCircleOutline,
      idCardOutline,
      lockClosedOutline,
      checkmarkCircleOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['name']) {
        this.fullName = params['name'];
      }
      if (params['username']) {
        this.username = params['username'];
      }
    });
  }

  async onRegister() {
    const username = this.username.trim().toLowerCase();
    const fullName = this.fullName.trim();
    const password = this.password.trim();
    const schoolVal = (this.school === 'Other School' && this.customSchool.trim())
      ? this.customSchool.trim()
      : (this.school || 'NEUST');

    if (!username) {
      await this.showToast('Please enter a username for your commuter account', 'warning');
      return;
    }

    if (!fullName) {
      await this.showToast('Please enter your Full Name', 'warning');
      return;
    }

    if (!password) {
      await this.showToast('Please create a password for your account', 'warning');
      return;
    }

    if (password.length < 4) {
      await this.showToast('Password must be at least 4 characters long', 'warning');
      return;
    }

    this.isSubmitting = true;
    const loader = await this.loadingCtrl.create({
      message: 'Creating student commuter account...',
      spinner: 'crescent',
    });
    await loader.present();

    // Auto-generate student ID behind the scenes so database uniqueness constraint is satisfied
    const generatedStudentNo = 'STU-' + Math.floor(100000 + Math.random() * 900000);

    const userPayload: Partial<UserAccount> = {
      student_no: generatedStudentNo,
      username: username,
      full_name: fullName,
      email: `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu.ph`,
      school: schoolVal || 'Araullo University (Main Campus)',
      course: 'BSIT',
      year_level: 1,
      password: password,
    };

    this.studentService.registerUser(userPayload).subscribe({
      next: async (res) => {
        await loader.dismiss();
        this.isSubmitting = false;
        await this.showToast(
          `Registered successfully! Welcome, ${userPayload.full_name}`,
          'success'
        );
        this.router.navigate(['/dashboard'], {
          queryParams: {
            user: userPayload.full_name,
            username: userPayload.username,
          },
        });
      },
      error: async (err) => {
        await loader.dismiss();
        this.isSubmitting = false;
        const msg = err?.error?.message || 'Could not register. Check your connection or XAMPP MySQL.';
        await this.showToast(msg, 'danger');
      },
    });
  }

  onBack() {
    this.router.navigate(['/get-started']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
