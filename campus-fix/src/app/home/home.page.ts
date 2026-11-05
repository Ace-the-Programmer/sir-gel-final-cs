import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomePage implements OnInit, OnDestroy {
  private timer: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.timer = setTimeout(() => {
      this.goToNext();
    }, 2500);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  goToNext() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.router.navigate(['/welcome'], { queryParams: { step: 0 } });
  }
}
