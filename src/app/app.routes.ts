import { Routes } from '@angular/router';
import {Home} from './shared/presentation/views/home/home';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const login =()=> import('./User/presentation/views/login/login').then(m => m.Login);
const register = ()=>import('./User/presentation/views/register/register').then(m => m.Register);
const baseTitle = 'WorkStation';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`  },
  { path: 'searching', loadChildren: () => import('./searching/presentation/views/searching.routes').then(m => m.searchingRoutes)},
  {path: 'profile',loadChildren: () => import('./User/presentation/user.routers').then(m => m.users)},
  {path: 'login',loadComponent:login},
  {path: 'register',loadComponent:register},
  { path: '', redirectTo: '/home', pathMatch: 'full'  },
  { path: '**', loadComponent:  pageNotFound, title: `${baseTitle} - Page Not Found`  },

];
