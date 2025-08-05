import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('./home-layout'),
    loadChildren: () => import('./pages/pages.routes'),
  },
];
export default homeRoutes;
