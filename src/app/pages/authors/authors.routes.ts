import { Routes } from '@angular/router';

export const authorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./authors-list/authors-list'),
  },
];
export default authorsRoutes;
