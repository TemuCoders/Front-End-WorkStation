import {Routes} from '@angular/router';

const workspaceList = () =>import('./workspace-list/workspace-list').then(m => m.WorkspaceList);

export const searchingRoutes: Routes = [
  { path: 'workspaces',           loadComponent: workspaceList }
]
