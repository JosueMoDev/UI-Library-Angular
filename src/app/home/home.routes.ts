import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('./pages/books/books.page'),
  },
];
export default homeRoutes;
