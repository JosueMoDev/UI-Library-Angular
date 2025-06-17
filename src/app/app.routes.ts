import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/books/books.routes'),
  },
  {
    path: 'authors',
    loadChildren: () => import('./pages/authors/authors.routes'),
  },
];
