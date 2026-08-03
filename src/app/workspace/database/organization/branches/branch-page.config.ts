import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const BRANCH_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/branches',
  searchFields: ['name', 'address', 'city', 'state'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'BRANCHES'
  },
  
  tableColumns: [
    { key: 'name', label: 'Nombre de Sede' },
    { key: 'city', label: 'Ciudad' },
    { key: 'is_central', label: 'Central', width: 'hidden md:table-cell', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'city'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'name', label: 'Nombre de la Sede' },
    { key: 'address', label: 'Dirección' },
    { 
      key: 'is_central', 
      label: 'Sede Central',
      type: 'boolean',
      booleanLabels: { trueLabel: 'Sí, es Central', falseLabel: 'No, es Sucursal' }
    },
    { key: 'index_sort', label: 'Orden' },
    { key: 'country', label: 'País' },
    { key: 'state', label: 'Estado' },
    { key: 'city', label: 'Ciudad' }
  ]
};
