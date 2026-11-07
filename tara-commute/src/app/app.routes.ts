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
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'google-auth',
    loadComponent: () => import('./google-auth/google-auth.page').then((m) => m.GoogleAuthPage),
  },
  {
    path: 'facebook-auth',
    loadComponent: () => import('./facebook-auth/facebook-auth.page').then((m) => m.FacebookAuthPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'location-search',
    loadComponent: () => import('./location-search/location-search.page').then((m) => m.LocationSearchPage),
  },
  {
    path: 'search-results',
    loadComponent: () => import('./search-results/search-results.page').then((m) => m.SearchResultsPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage),
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
