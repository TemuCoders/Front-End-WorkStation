import { Routes } from '@angular/router';

const User = () => import('./views/profile/profile').then(m => m.Profile);


export const users: Routes = [
  { path: ':id',  loadComponent: User }  // /Profile/123
];
