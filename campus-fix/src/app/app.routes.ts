import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'get-started',
    loadComponent: () => import('./get-started/get-started.page').then((m) => m.GetStartedPage),
  },
  {
    path: 'google-auth',
    loadComponent: () => import('./google-auth/google-auth.page').then((m) => m.GoogleAuthPage),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'map',
    loadComponent: () => import('./map/map.page').then((m) => m.MapPage),
  },
];
