import { Routes } from '@angular/router';

export const pagesRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./books/books.page'),
  },
];
export default pagesRoutes;
