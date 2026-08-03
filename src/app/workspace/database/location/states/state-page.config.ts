import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const STATE_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/location/states',
  searchFields: ['name', 'state_code', 'country'],
  deferLoading: true,
  fetchRoute: 'byCountry',
  sortConfig: { key: 'index_state', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'STATES',
    ttlMinutes: 60
  },
  
  tableColumns: [
    { key: 'emoji', label: '', width: 'w-10', align: 'center' },
    { key: 'name', label: 'Estado / Región' },
    { key: 'country', label: 'País' },
    { key: 'state_code', label: 'Código', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: { titleField: 'name', subtitleField: 'id', subtitleLabel: 'ID'},
  
  detailFields: [
    { key: 'name', label: 'Nombre del Estado', type: 'text' },
    { key: 'country', label: 'País', type: 'text' },
    { key: 'state_code', label: 'Código ISO/Interno', type: 'text' },
    { key: 'zone', label: 'Zona Global', type: 'enum' },
    { key: 'chis', label: 'Es Chiapas', type: 'boolean', booleanLabels: { trueLabel: 'Sí', falseLabel: 'No' } },
    { key: 'index_state', label: 'Ordenamiento Interno', type: 'text' }
  ]
};
