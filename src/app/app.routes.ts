import { Routes } from '@angular/router';
import {Home} from './shared/presentation/views/home/home';
import {AuthLayout} from './shared/presentation/components/layout-auth/layout-auth';
import { Layout } from './shared/presentation/components/layout/layout';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const login =()=> import('./User/presentation/views/login/login').then(m => m.Login);
const register = ()=>import('./User/presentation/views/register/register').then(m => m.Register);
const baseTitle = 'WorkStation';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', loadComponent: login, title: `${baseTitle} - Login` },
      { path: 'register', loadComponent: register, title: `${baseTitle} - Registro` },
    ]
  },

  // Layout con navbar/footer
  {
    path: '',
    component: Layout, 
    children: [
      { path: 'home', component: Home, title: `${baseTitle} - Home` },
      { path: 'searching', loadChildren: () => import('./searching/presentation/views/searching.routes').then(m => m.searchingRoutes)},
      { path: 'payments', loadChildren: () => import('./payment-management/presentation/views/payment-management.routes')
      .then(m => m.paymentRoutes) },
      { path: 'reviews', loadChildren: () => import('./reviews/presentation/views/reviews.routes')
      .then(m => m.reviewsRoutes) },
      { path: 'profile', loadChildren: () => import('./User/presentation/user.routers').then(m => m.users) },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', loadComponent:  pageNotFound, title: `${baseTitle} - Page Not Found`  },
];
