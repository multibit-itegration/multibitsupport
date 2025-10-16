import { Routes } from '@angular/router';

export const routes: Routes = [
  // { path: '', redirectTo: '/rating', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./components/task-rating.component').then(m => m.TaskRatingComponent),
  },
  // { path: '**', redirectTo: '/rating' },
];

