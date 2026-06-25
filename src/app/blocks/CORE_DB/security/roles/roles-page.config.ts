import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';

export const ROLES_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/security/roles',
  tableColumns: [
    { key: 'id', label: 'ID', width: 'w-16' },
    { key: 'name', label: 'Nombre del Rol' },
    { key: 'description', label: 'Descripción', width: 'whitespace-normal break-words max-w-md' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  searchFields: ['name', 'description'],
  cacheConfig: {
    enabled: true,
    key: 'ROLES',
    ttlMinutes: 10
  },
  detailHeader: {
    titleField: 'name',
    subtitleField: 'id'
  },
  detailFields: [
    { key: 'description', label: 'Descripción de Permisos y Acceso' }
  ]
};
