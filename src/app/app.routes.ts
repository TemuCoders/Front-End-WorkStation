import { Routes } from '@angular/router';
import {Home} from './shared/presentation/views/home/home';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'WorkStation';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`  },
  { path: 'searching', loadChildren: () => import('./searching/presentation/views/searching.routes').then(m => m.searchingRoutes)},
  {path: 'Profile',loadChildren: () => import('./User/presentation/user.routers').then(m => m.users)},
  {path: 'profile',loadChildren: () => import('./User/presentation/user.routers').then(m => m.users)},
  { path: '', redirectTo: '/home', pathMatch: 'full'  },
  { path: '**', loadComponent:  pageNotFound, title: `${baseTitle} - Page Not Found`  },

];
