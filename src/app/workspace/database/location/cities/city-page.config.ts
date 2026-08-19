import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const CITY_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/location/cities',
  searchFields: ['name', 'state', 'country'],
  deferLoading: true,
  fetchRoute: 'byState',
  sortConfig: { key: 'name', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'CITIES'
  },
  
  tableColumns: [
    { key: 'emoji', label: 'B', width: 'w-12', align: 'center' },
    { key: 'name', label: 'Ciudad' },
    { key: 'state', label: 'Estado' },
    { key: 'country', label: 'País', width: 'hidden sm:table-cell' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    emojiField: 'emoji',
    titleField: 'name',
    subtitleField: 'state'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'country', label: 'País Perteneciente' },
    { key: 'state', label: 'Estado' },
    { key: 'latitude', label: 'Latitud' },
    { key: 'longitude', label: 'Longitud' },
    { 
      key: 'latitude', 
      label: 'Ubicación Geográfica', 
      type: 'link', 
      linkBuilder: (data: any) => `https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
      prefix: 'Ver en Google Maps '
    }
  ]
};
