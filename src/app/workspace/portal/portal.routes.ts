import { Routes } from '@angular/router';
import { DashboardComponent } from '@dashboard/page/dashboard.component';
import { UserSettingsComponent } from '@user-settings/page/user-settings.component';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
    title: 'Sistema Integral de Control Documental'
  },
  {
    path: 'profile',
    component: UserSettingsComponent,
    title: 'Configuración del Usuario'
  }
];
