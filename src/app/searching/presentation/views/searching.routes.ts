import {Routes} from '@angular/router';

const workspaceList = () =>import('./workspace-list/workspace-list').then(m => m.WorkspaceList);
const workspaceForm = () =>import('./workspace-form/workspace-form').then(m => m.WorkspaceForm);

export const searchingRoutes: Routes = [
  { path: 'workspaces',           loadComponent: workspaceList },
  { path: 'workspaces/new',       loadComponent: workspaceForm },
  { path: 'workspaces/edit/:id',  loadComponent: workspaceForm }
]
