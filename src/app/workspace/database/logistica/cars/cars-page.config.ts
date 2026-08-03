import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const CARS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/logistic/cars',
  sortConfig: { key: 'name', direction: 'asc' },
  cacheConfig: {
    enabled: true,
    key: 'CARS',
    ttlMinutes: 60
  },
  
  tableColumns: [
    { key: 'name', label: 'Nombre', width: 'w-48' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo', align: 'center' },
    { key: 'placas', label: 'Placas', align: 'center' },
    { key: 'category', label: 'Categoría', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'marca'
  },
  
  detailFields: [
    { key: 'name', label: 'Nombre del Vehículo', type: 'text' },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'modelo', label: 'Modelo', type: 'text' },
    { key: 'tipo', label: 'Tipo', type: 'text' },
    { key: 'placas', label: 'Placas', type: 'text' },
    { key: 'rendimiento', label: 'Rendimiento (km/l)', type: 'number' },
    { key: 'category', label: 'Categoría', type: 'text' }
  ],
  
  searchFields: ['name', 'marca', 'modelo', 'placas']
};
