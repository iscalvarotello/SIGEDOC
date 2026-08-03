import { Routes } from '@angular/router';

export const SYSTEM_ROUTES: Routes = [
  // ============================================
  // SEGURIDAD: CONTROL DE USUARIOS
  // ============================================
  {
    path: 'security/users',
    loadComponent: () => import('./security/users/usuarios-page.component').then(m => m.UsuariosPageComponent),
    title: 'Seguridad - Control de Usuarios'
  },
  {
    path: 'security/users/new',
    loadComponent: () => import('./security/users/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    title: 'Nuevo Usuario'
  },
  {
    path: 'security/users/:id',
    loadComponent: () => import('./security/users/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    title: 'Editar Usuario'
  },
  // ============================================
  // SEGURIDAD: ROLES
  // ============================================
  {
    path: 'security/roles',
    loadComponent: () => import('./security/roles/roles-page.component').then(m => m.RolesPageComponent),
    title: 'Seguridad - Roles'
  },
  {
    path: 'security/roles/new',
    loadComponent: () => import('./security/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
    title: 'Nuevo Rol'
  },
  {
    path: 'security/roles/:id',
    loadComponent: () => import('./security/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
    title: 'Editar Rol'
  },
  // ============================================
  // SEGURIDAD: PERMISOS
  // ============================================
  {
    path: 'security/permissions',
    loadComponent: () => import('./security/permissions/permissions-page.component').then(m => m.PermissionsPageComponent),
    title: 'Seguridad - Permisos por Rol'
  },
  // ============================================
  // SEGURIDAD: CONFIGURACIONES GENERALES
  // ============================================
  {
    path: 'settings/generales',
    loadComponent: () => import('./settings/generales/generales-page.component').then(m => m.GeneralesPageComponent),
    title: 'Configuraciones Generales'
  },
  {
    path: 'security/document-types',
    loadComponent: () => import('./security/document-types/document-type-catalog-page.component').then(m => m.DocumentTypeCatalogPageComponent),
    title: 'Tipos de Documento'
  },
  {
    path: 'security/document-types/new',
    loadComponent: () => import('./security/document-types/document-type-catalog-form/document-type-catalog-form.component').then(m => m.DocumentTypeCatalogFormComponent),
    title: 'Nuevo Tipo de Documento'
  },
  {
    path: 'security/document-types/:id',
    loadComponent: () => import('./security/document-types/document-type-catalog-form/document-type-catalog-form.component').then(m => m.DocumentTypeCatalogFormComponent),
    title: 'Editar Tipo de Documento'
  },
  {
    path: 'security/templates',
    loadComponent: () => import('./security/templates/document-template-page.component').then(m => m.DocumentTemplatesPageComponent),
    title: 'Plantillas'
  },
  {
    path: 'security/templates/new',
    loadComponent: () => import('./security/templates/document-template-form/document-template-form.component').then(m => m.DocumentTemplateFormComponent),
    title: 'Nueva Plantilla'
  },
  {
    path: 'security/templates/:id',
    loadComponent: () => import('./security/templates/document-template-form/document-template-form.component').then(m => m.DocumentTemplateFormComponent),
    title: 'Editar Plantilla'
  },
  // ============================================
  // SETTINGS: CRON JOBS
  // ============================================
  {
    path: 'settings/cron',
    loadComponent: () => import('./settings/cron/cron-page.component').then(m => m.CronPageComponent),
    title: 'Tareas Programadas (Cron Jobs)'
  },
  {
    path: 'settings/cron/new',
    loadComponent: () => import('./settings/cron/cron-form.component').then(m => m.CronFormComponent),
    title: 'Nuevo Cron Job'
  },
  {
    path: 'settings/cron/:id',
    loadComponent: () => import('./settings/cron/cron-form.component').then(m => m.CronFormComponent),
    title: 'Editar Cron Job'
  },
  // ============================================
  // SETTINGS: DOCUMENTATION
  // ============================================
  {
    path: 'settings/manuals',
    loadComponent: () => import('./documentation/manuals-page.component').then(m => m.ManualsPageComponent),
    title: 'Manuales del Sistema'
  }
];
