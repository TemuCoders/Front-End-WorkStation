import { Routes } from '@angular/router';

const User = () => import('./views/profile/profile').then(m => m.Profile);
const userEdit = ()=> import('./views/edit-profile/edit-profile').then(m => m.EditProfile);

export const users: Routes = [
  { path: ':id/edit',  loadComponent: userEdit },
  { path: ':id',  loadComponent: User } , // /Profile/123

];
