import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const AREA_TYPE_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/area-types',
  searchFields: ['name'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'AREA_TYPES'
  },
  
  tableColumns: [
    { key: 'name', label: 'Tipo de Área' },
    { key: 'hierarchy_order', label: 'Nivel Jerárquico', align: 'center', width: 'w-32' },
    { key: 'index_sort', label: 'Orden', align: 'center', width: 'w-24' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'hierarchy_order'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'name', label: 'Nombre del Tipo de Área' },
    { key: 'hierarchy_order', label: 'Nivel Jerárquico' },
    { key: 'index_sort', label: 'Índice de Ordenamiento' },
    { 
      key: 'active', 
      label: 'Estado',
      type: 'boolean',
      booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' }
    }
  ]
};
