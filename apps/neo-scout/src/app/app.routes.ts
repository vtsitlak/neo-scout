import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@neo-scout/pages/home').then((m) => m.Home),
  },
  {
    path: 'scout',
    loadComponent: () => import('@neo-scout/pages/scout').then((m) => m.Scout),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@neo-scout/pages/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
