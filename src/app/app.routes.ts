import { Routes } from '@angular/router';
import {AuthLayout} from './shared/presentation/components/layout-auth/layout-auth';
import { Layout } from './shared/presentation/components/layout/layout';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const login =()=> import('./User/presentation/views/login/login').then(m => m.Login);
const register = ()=>import('./User/presentation/views/register/register').then(m => m.Register);
const workspaceForm = () => import('./searching/presentation/components/workspace-form/workspace-form.component').then(m => m.WorkspaceFormComponent);
const workspaceList= ()=> import('./searching/presentation/views/my-spaces-list/my-spaces-list').then(m => m.MySpacesListComponent);
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
      { path: 'searching', loadChildren: () => import('./searching/presentation/views/searching.routes').then(m => m.searchingRoutes)},
      { path: 'my-spaces/create', loadComponent: workspaceForm, title: `${baseTitle} - Crear Espacio` },
      { path: 'payments', loadChildren: () => import('./payment-management/presentation/views/payment-management.routes')
      .then(m => m.paymentRoutes) },
      { path: 'reviews', loadChildren: () => import('./reviews/presentation/views/reviews.routes')
      .then(m => m.reviewsRoutes) },
      { path: 'my-spaces', loadComponent: workspaceList, title: `${baseTitle} - My Spaces` },
      { path: 'profile', loadChildren: () => import('./User/presentation/user.routers').then(m => m.users) },
      {path: 'bookings', loadChildren: () => import('./bookings/presentation/bookings.routes').then(m => m.bookingsRoutes),
      }
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', loadComponent:  pageNotFound, title: `${baseTitle} - Page Not Found`  },
];
