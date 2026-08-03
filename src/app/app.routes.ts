import { Routes } from '@angular/router';
import { DashboardComponent } from '@dashboard/page/dashboard.component';
import { UserSettingsComponent } from '@user-settings/page/user-settings.component';
import { authGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from '@metasystem/shell/app-layout/app-layout.component';
import { DocumentViewerPageComponent } from '@documentos/pages/document-viewer/document-viewer-page.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate: [authGuard],
    children:[
      {
        path: '',
        loadChildren: () => import('./workspace/workspace.routes').then(m => m.WORKSPACE_ROUTES)
      }
    ]
  },
  // Standalone Pages
  {
    path: 'view-document/:id',
    component: DocumentViewerPageComponent,
    canActivate: [authGuard],
    title: 'Visor de Documento'
  },
  // Gateway (Auth, Errors)
  {
    path: '',
    loadChildren: () => import('@gateway/gateway.routes').then(m => m.GATEWAY_ROUTES)
  }
];
