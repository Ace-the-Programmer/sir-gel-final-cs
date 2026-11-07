import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, schoolOutline, checkmarkCircle } from 'ionicons/icons';
import { StudentService, Student } from '../services/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
  ],
})
export class DashboardPage implements OnInit {
  currentStudent: Student | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
    addIcons({ search, schoolOutline, checkmarkCircle });
  }

  ngOnInit() {
    this.loadCommuter();
  }

  ionViewDidEnter() {
    this.loadCommuter();
  }

  loadCommuter() {
    this.currentStudent = this.studentService.getCurrentStudent();
  }

  goToLocation() {
    this.router.navigate(['/location-search']);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  onHomeClick() {
    // Already on Home
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }
}
