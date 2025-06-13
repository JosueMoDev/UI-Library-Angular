import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./book-page/book-page.component'),
  },
];
export default booksRoutes;
