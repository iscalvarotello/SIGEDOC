import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForceResetPasswordComponent } from './auth/force-reset-password/force-reset-password.component';
import { MaintenanceComponent } from './auth/maintenance/maintenance.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { FirmaRemotaComponent } from './firma-remota/firma-remota.component';

export const GATEWAY_ROUTES: Routes = [
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Inicio de Sesión'
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Registro de Cuenta'
  },
  {
    path: 'reset-password-required',
    component: ForceResetPasswordComponent,
    title: 'Restablecimiento de Contraseña Obligatorio'
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    title: 'Sistema en Mantenimiento'
  },
  {
    path: 'firma-remota',
    component: FirmaRemotaComponent,
    title: 'Firma Remota por Lotes'
  },
  // error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Página no Encontrada'
  }
];
