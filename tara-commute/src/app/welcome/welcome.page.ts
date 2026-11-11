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
  IonCheckbox,
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
  shieldCheckmarkOutline,
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
    IonCheckbox,
  ],
})
export class WelcomePage implements OnInit {
  username: string = '';
  fullName: string = '';
  school: string = 'NEUST';
  customSchool: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  agreeTerms: boolean = true;
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
      shieldCheckmarkOutline,
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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

  // Client-side Form Validation Constraints
  validateRegisterForm(): string | null {
    const uname = this.username.trim().toLowerCase();
    const fname = this.fullName.trim();
    const pwd = this.password.trim();
    const cpwd = this.confirmPassword.trim();

    // 1. Username constraints (3-30 characters, alphanumeric + underscore + dot)
    if (!uname) {
      return 'Please enter a username for your commuter account.';
    }
    if (uname.length < 3) {
      return 'Username must be at least 3 characters long.';
    }
    if (uname.length > 30) {
      return 'Username cannot exceed 30 characters.';
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(uname)) {
      return 'Username can only contain letters, numbers, dots, and underscores (no spaces).';
    }

    // 2. Full Name constraints (at least 3 characters, alphabetical)
    if (!fname) {
      return 'Please enter your Full Name.';
    }
    if (fname.length < 3) {
      return 'Full Name must be at least 3 characters long.';
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(fname)) {
      return 'Full Name must contain valid alphabetical characters.';
    }

    // 3. School constraints
    if (this.school === 'Other School' && (!this.customSchool || this.customSchool.trim().length < 2)) {
      return 'Please specify the name of your school or campus.';
    }

    // 4. Password constraints (minimum 6 characters, must include letters & numbers)
    if (!pwd) {
      return 'Please create a password for your account.';
    }
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long for account security.';
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(pwd)) {
      return 'Password must contain at least one letter and one number.';
    }

    // 5. Confirm Password match constraint
    if (!cpwd) {
      return 'Please confirm your password.';
    }
    if (pwd !== cpwd) {
      return 'Passwords do not match. Please verify both password entries.';
    }

    // 6. Student terms agreement
    if (!this.agreeTerms) {
      return 'Please agree to the student commuter terms to register.';
    }

    return null;
  }

  async onRegister() {
    const validationError = this.validateRegisterForm();
    if (validationError) {
      await this.showToast(validationError, 'warning');
      return;
    }

    const username = this.username.trim().toLowerCase();
    const fullName = this.fullName.trim();
    const password = this.password.trim();
    const schoolVal = (this.school === 'Other School' && this.customSchool.trim())
      ? this.customSchool.trim()
      : (this.school || 'NEUST');

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
        const msg = err?.error?.message || 'Could not register. Check your connection or MySQL database.';
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
