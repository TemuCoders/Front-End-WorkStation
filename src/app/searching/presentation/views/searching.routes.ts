import {Routes} from '@angular/router';

const SpacesView = () =>import('../views/spaces-view/spaces-view').then(m => m.SpacesView);

const SpaceDetailPage = () =>import('../views/space-detail/space-detail').then(m => m.WorkspaceDetailPage);

export const searchingRoutes: Routes = [
  { path: 'workspaces',           loadComponent: SpacesView }
  , { path: 'workspaces/reserve/:id',     loadComponent: SpaceDetailPage }
]
