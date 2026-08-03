import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const FUEL_STATION_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/fuel-stations',
  fetchRoute: 'byProvider',
  deferLoading: true,
  searchFields: ['name', 'razon_social', 'address'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'FUEL_STATIONS'
  },
  
  tableColumns: [
    { key: 'name', label: 'Nombre de Sucursal' },
    { key: 'supplier_name', label: 'Proveedor' },
    { key: 'city_name', label: 'Ciudad' },
    { key: 'active', label: 'Estatus' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'razon_social'
  },
  
  detailFields: [
    { key: 'supplier_name', label: 'Proveedor' },
    { key: 'address', label: 'Dirección' },
    { key: 'cp', label: 'Código Postal' },
    { key: 'location', label: 'Ubicación (Maps)' },
    { key: 'city_name', label: 'Ciudad' },
    { key: 'state_name', label: 'Estado' },
    { key: 'country_name', label: 'País' },
    { key: 'index_sort', label: 'Orden' }
  ]
};
