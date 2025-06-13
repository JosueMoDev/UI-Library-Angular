import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./book-list/book-list'),
  },
];
export default booksRoutes;
