import { Routes } from '@angular/router';
import { DocumentPageComponent } from '@documentos/pages/document/document-page.component';
import { FormNewPageComponent } from '@documentos/pages/form-new-page/form-new-page.component';
import { FormEditPageComponent } from '@documentos/pages/form-edit-page/form-edit-page.component';

export const OPERATIVIDAD_ROUTES: Routes = [
  {
    path: 'comisiones',
    loadComponent: () => import('./comisiones/comisiones-page.component').then(m => m.ComisionesPageComponent),
    title: 'Comisiones (Operatividad)'
  },
  {
    path: 'documento/:claseDocumentoId',
    component: DocumentPageComponent,
    title: 'Memorandums, Oficios, Tarjetas Informativas y Circulares'
  },
  {
    path: 'form-new-document/:claseDocumentoId',
    component: FormNewPageComponent,
    title: 'Nuevo documento - Memorandums, Oficios, Tarjetas Informativas y Circulares'
  },
  {
    path: 'edit-document/:id',
    component: FormEditPageComponent,
    title: 'Editar documento - Memorandums, Oficios, Tarjetas Informativas y Circulares'
  },
  {
    path: 'recepcion-externa',
    loadComponent: () => import('./documentos/pages/form-external-page/form-external-page.component').then(m => m.FormExternalPageComponent),
    title: 'Recepción de Documentos Externos - Oficialía de Partes'
  },
  {
    path: 'documento/:claseDocumentoId/templates',
    loadComponent: () => import('./documentos/pages/template-manager-page/template-manager-page.component').then(m => m.TemplateManagerPageComponent),
    title: 'Gestor de Plantillas'
  }
];
