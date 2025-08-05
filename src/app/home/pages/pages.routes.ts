import { Routes } from '@angular/router';

export const pagesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./books/books.page'),
  },
  {
    path: 'authors',
    loadComponent: () => import('./authors/authors-page'),
  },
  {
    path: 'genres',
    loadComponent: () => import('./genres/genres-page'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
export default pagesRoutes;
