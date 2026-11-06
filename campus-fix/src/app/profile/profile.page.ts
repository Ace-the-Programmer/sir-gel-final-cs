import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonImg,
  IonButton,
  IonIcon,
  IonText,
  IonList,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonItem,
  IonLabel,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  pencil,
  logOutOutline,
  schoolOutline,
  idCardOutline,
  syncOutline,
  peopleOutline,
  addCircleOutline,
  serverOutline,
  checkmarkCircle,
  chevronDown,
  chevronUp,
  trashOutline,
  timeOutline,
  navigateOutline,
  person,
} from 'ionicons/icons';
import { StudentService, Student, CommuteTrip, UserAccount } from '../services/student.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonImg,
    IonButton,
    IonIcon,
    IonText,
    IonList,
    IonCard,
    IonCardContent,
    IonBadge,
    IonSpinner,
    IonItem,
    IonLabel,
  ],
})
export class ProfilePage implements OnInit {
  selectedCard: number = -1;

  // Active student profile loaded dynamically from session or local backend
  currentStudent: Student = {
    student_no: '2026-0001',
    full_name: 'Juan Dela Cruz',
    course: 'BSIT',
    year_level: 4,
  };

  // Student directory loaded via GET /api/students.php
  studentList: Student[] = [];
  isLoadingStudents: boolean = false;
  showDirectory: boolean = false;
  localApiUrl: string = '';

  // Commute trips loaded via GET /api/history.php
  commuteTrips: CommuteTrip[] = [];
  isLoadingTrips: boolean = false;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      pencil,
      logOutOutline,
      schoolOutline,
      idCardOutline,
      syncOutline,
      peopleOutline,
      addCircleOutline,
      serverOutline,
      checkmarkCircle,
      chevronDown,
      chevronUp,
      trashOutline,
      timeOutline,
      navigateOutline,
      person,
    });
  }

  ngOnInit() {
    this.localApiUrl = this.studentService.getApiUrl();
    this.loadCurrentStudent();
    this.fetchStudentsFromApi();
    this.loadCommuteHistory();
  }

  ionViewDidEnter() {
    this.localApiUrl = this.studentService.getApiUrl();
    this.loadCurrentStudent();
    this.fetchStudentsFromApi();
    this.loadCommuteHistory();
  }

  loadCurrentStudent() {
    const student = this.studentService.getCurrentStudent();
    if (student && student.student_no) {
      this.currentStudent = student;
    }
  }

  getFormattedYearLevel(year: number | string | undefined): string {
    const y = Number(year);
    if (!y || isNaN(y)) return `${year || 1}st Year`;
    switch (y) {
      case 1:
        return '1st Year';
      case 2:
        return '2nd Year';
      case 3:
        return '3rd Year';
      case 4:
        return '4th Year';
      default:
        return `${y}th Year`;
    }
  }

  // Fetch commute history from MySQL commute_history table
  loadCommuteHistory() {
    this.isLoadingTrips = true;
    this.studentService.getCommuteHistory(this.currentStudent.student_no).subscribe({
      next: (response) => {
        this.isLoadingTrips = false;
        if (response && response.data) {
          this.commuteTrips = response.data;
        }
      },
      error: (err) => {
        this.isLoadingTrips = false;
        console.warn('Could not fetch commute history from MySQL:', err);
      },
    });
  }

  // CO3 Requirement: GET operation (Fetch from Localhost students.php)
  fetchStudentsFromApi() {
    this.isLoadingStudents = true;
    this.studentService.getStudents().subscribe({
      next: (response) => {
        this.isLoadingStudents = false;
        if (response && response.data) {
          this.studentList = response.data;
          const matched = this.studentList.find(
            (s) => s.student_no === this.currentStudent.student_no
          );
          if (matched) {
            this.currentStudent = matched;
          }
        }
      },
      error: (err) => {
        this.isLoadingStudents = false;
        console.warn('Could not fetch students from Localhost:', err);
      },
    });
  }

  toggleDirectory() {
    this.showDirectory = !this.showDirectory;
    if (this.showDirectory && this.studentList.length === 0) {
      this.fetchStudentsFromApi();
    }
  }

  selectStudentFromList(student: Student) {
    this.currentStudent = student;
    this.studentService.setCurrentStudent(student);
    this.loadCommuteHistory();
    this.showToast(`Switched active commuter profile to: ${student.full_name}`, 'success');
  }

  // Quick prompt to register a new student on Localhost (POST operation)
  async openAddStudentDialog() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const alert = await this.alertCtrl.create({
      header: 'Register Campus Commuter',
      subHeader: 'POST to Localhost: ' + this.localApiUrl,
      inputs: [
        {
          name: 'student_no',
          type: 'text',
          placeholder: 'Student ID No.',
          value: `2026-${rand}`,
        },
        {
          name: 'full_name',
          type: 'text',
          placeholder: 'Full Name',
          value: '',
        },
        {
          name: 'course',
          type: 'text',
          placeholder: 'Course (e.g. BSIT)',
          value: 'BSIT',
        },
        {
          name: 'year_level',
          type: 'number',
          placeholder: 'Year Level (1-4)',
          value: 4,
          min: 1,
          max: 4,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Register (POST)',
          handler: (data) => {
            if (!data.student_no || !data.full_name) {
              this.showToast('Please fill out student ID and name.', 'warning');
              return false;
            }
            this.submitNewStudent({
              student_no: data.student_no.trim(),
              full_name: data.full_name.trim(),
              course: (data.course || 'BSIT').trim(),
              year_level: Number(data.year_level) || 1,
            });
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  submitNewStudent(payload: Student) {
    this.studentService.registerUser({
      student_no: payload.student_no,
      full_name: payload.full_name,
      course: payload.course,
      year_level: payload.year_level,
      password: 'password123',
    }).subscribe({
      next: (res) => {
        this.showToast(`Commuter ${payload.full_name} registered in Localhost database!`, 'success');
        this.currentStudent = payload;
        this.fetchStudentsFromApi();
        this.loadCommuteHistory();
      },
      error: (err) => {
        this.showToast('Could not reach Localhost. Ensure Apache & MySQL are running in XAMPP.', 'warning');
        console.error('POST Error:', err);
      },
    });
  }

  // Dialog to log a new trip into MySQL commute_history
  async openLogTripDialog() {
    const alert = await this.alertCtrl.create({
      header: 'Log New Commute Trip',
      subHeader: 'Save trip to MySQL commute_history',
      inputs: [
        {
          name: 'origin',
          type: 'text',
          placeholder: 'Origin (e.g. AU Main Gate)',
          value: 'Sumacab Campus',
        },
        {
          name: 'destination',
          type: 'text',
          placeholder: 'Destination (e.g. SM Mega Center)',
          value: 'SM City Cabanatuan',
        },
        {
          name: 'mode',
          type: 'text',
          placeholder: 'Mode: tricycle / car / bicycle / walk',
          value: 'tricycle',
        },
        {
          name: 'distance_km',
          type: 'number',
          placeholder: 'Distance (km)',
          value: 3.2,
        },
        {
          name: 'fare_amount',
          type: 'number',
          placeholder: 'Fare (₱)',
          value: 65,
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save Trip',
          handler: (data) => {
            if (!data.origin || !data.destination) {
              this.showToast('Origin and destination are required', 'warning');
              return false;
            }
            this.studentService
              .logTrip({
                student_no: this.currentStudent.student_no,
                origin: data.origin.trim(),
                destination: data.destination.trim(),
                mode: data.mode.trim().toLowerCase() || 'tricycle',
                distance_km: Number(data.distance_km) || 0,
                fare_amount: Number(data.fare_amount) || 0,
              })
              .subscribe({
                next: () => {
                  this.showToast('Trip logged to MySQL database!', 'success');
                  this.loadCommuteHistory();
                },
                error: (err) => {
                  this.showToast('Failed to save trip to MySQL', 'danger');
                  console.error(err);
                },
              });
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  // Delete trip from MySQL
  deleteTrip(trip: CommuteTrip, event: Event) {
    event.stopPropagation();
    if (!trip.id) return;

    this.studentService.deleteTrip(trip.id).subscribe({
      next: () => {
        this.commuteTrips = this.commuteTrips.filter((t) => t.id !== trip.id);
        this.showToast('Trip removed from database.', 'success');
      },
      error: (err) => {
        this.showToast('Failed to delete trip from MySQL', 'danger');
        console.error(err);
      },
    });
  }

  getModeIcon(mode: string): string {
    const m = (mode || '').toLowerCase();
    if (m === 'car') return 'assets/icon/mode-car.png';
    if (m === 'bicycle' || m === 'bike') return 'assets/icon/mode-bicycle.png';
    return 'assets/icon/mode-tricycle.png';
  }

  selectHistory(index: number) {
    this.selectedCard = this.selectedCard === index ? -1 : index;
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  goToRoute() {
    this.router.navigate(['/location-search']);
  }

  onLogout() {
    this.studentService.clearCurrentStudent();
    this.router.navigate(['/login']);
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
