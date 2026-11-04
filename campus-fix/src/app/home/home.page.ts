import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonText, IonImg],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Optional: auto-advance after 3 seconds
    setTimeout(() => {
      this.goToNext();
    }, 3000);
  }

  goToNext() {
    this.router.navigate(['/get-started']);
  }
}
