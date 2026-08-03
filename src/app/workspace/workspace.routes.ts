import { Routes } from '@angular/router';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./portal/portal.routes').then(m => m.PORTAL_ROUTES)
  },
  {
    path: 'operatividad',
    loadChildren: () => import('./operatividad/operatividad.routes').then(m => m.OPERATIVIDAD_ROUTES)
  },
  {
    path: 'database',
    loadChildren: () => import('./database/database.routes').then(m => m.DATABASE_ROUTES)
  },
  {
    path: 'system',
    loadChildren: () => import('./system/system.routes').then(m => m.SYSTEM_ROUTES)
  }
];
