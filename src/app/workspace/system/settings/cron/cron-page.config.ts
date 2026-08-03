import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const CRON_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/system/settings/cron',
  searchFields: ['name', 'task_code'],
  sortConfig: { key: 'name', direction: 'asc' },
  
  cacheConfig: {
    enabled: false,
    key: 'CRON_JOBS',
    ttlMinutes: 0
  },
  
  tableColumns: [
    { key: 'name', label: 'Nombre' },
    { key: 'task_code', label: 'Tarea' },
    { key: 'is_active', label: 'Activo', width: 'w-16', align: 'center', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' } },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'task_code',
    subtitleLabel: 'Tarea'
  },
  
  detailFields: [
    { key: 'is_active', label: 'Estado', type: 'boolean', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' } },
    { key: 'timezone', label: 'Zona Horaria' },
    { key: 'dependencia', label: 'Dependencia' }
  ]
};
