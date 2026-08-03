import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const PARTIDA_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/partidas',
  searchFields: ['partida', 'descripcion'],
  sortConfig: { key: 'partida', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'PARTIDAS'
  },
  
  tableColumns: [
    { key: 'partida', label: 'Clave Partida', width: 'w-40' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'partida',
    subtitleField: 'descripcion'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'partida', label: 'Clave de Partida' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'full_name', label: 'Nombre Completo (Computado)' },
    { 
      key: 'active', 
      label: 'Estado',
      type: 'boolean',
      booleanLabels: { trueLabel: 'Activa', falseLabel: 'Inactiva' }
    }
  ]
};
