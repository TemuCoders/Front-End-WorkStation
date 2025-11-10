import {Routes} from '@angular/router';

const SpacesView = () =>import('../views/spaces-view/spaces-view').then(m => m.SpacesView);

export const searchingRoutes: Routes = [
  { path: 'workspaces',           loadComponent: SpacesView }
]
