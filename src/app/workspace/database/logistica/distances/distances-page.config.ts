import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const DISTANCES_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/logistic/distances',
  fetchRoute: 'getByOrigin',
  deferLoading: true, // Esperamos a que el usuario seleccione la ciudad de origen
  cacheConfig: {
    enabled: true,
    key: 'DISTANCES_BY_ORIGIN',
    ttlMinutes: 60
  },
  searchFields: ['destination_city', 'via'], // No tenemos el nombre de la ciudad destino aplanado, pero la búsqueda por vía sirve.
  tableColumns: [
    { key: 'destination_city', label: 'Destino' }, 
    { key: 'via', label: 'Vía' },
    { key: 'distance_km', label: 'Distancia (KM)', align: 'center' },
    { key: 'car_pickup', label: 'Costo Casetas ($)', align: 'center' },
    { key: 'travel_scope', label: 'Alcance', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  detailHeader: {
    titleField: 'destination_city',
    subtitleField: 'via'
  },
  detailFields: [
    { key: 'distance_km', label: 'Distancia (KM)' },
    { key: 'moto', label: 'Gasto Moto ($)' },
    { key: 'car_pickup', label: 'Gasto Auto/PickUp ($)' },
    { key: 'bus', label: 'Gasto Autobús ($)' },
    { key: 'truck_4x', label: 'Gasto Camión 4 Ejes ($)' },
    { key: 'truck_6x', label: 'Gasto Camión 6 Ejes ($)' },
    { key: 'truck_9x', label: 'Gasto Camión 9 Ejes ($)' },
    { key: 'eea', label: 'Gasto Eje Excedente Auto ($)' },
    { key: 'eec', label: 'Gasto Eje Excedente Camión ($)' }
  ]
};
