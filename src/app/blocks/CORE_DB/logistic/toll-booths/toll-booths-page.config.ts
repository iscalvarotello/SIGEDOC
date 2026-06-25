import { PageControllerConfig } from '../../../../shared/components/master-detail/master-detail.interfaces';

export const TOLL_BOOTHS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/logistic/toll-booths',
  searchFields: ['name'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  cacheConfig: { enabled: true, key: 'TOLL_BOOTHS', ttlMinutes: 30 },
  
  tableColumns: [
    { key: 'name', label: 'Nombre de la Caseta' },
    { key: 'moto', label: 'Motocicleta', align: 'center', width: '120px' },
    { key: 'car_pickup', label: 'Auto/Pickup', align: 'center', width: '120px' },
    { key: 'bus', label: 'Autobús', align: 'center', width: '120px' },
    { key: 'isActive', label: 'Activo', align: 'center', width: '120px', booleanLabels: { trueLabel: 'Sí', falseLabel: 'No' } }
  ],
  
  detailHeader: {
    titleField: 'name'
  },
  
  detailFields: [
    { key: 'name', label: 'Nombre', type: 'text' },
    { key: 'moto', label: 'Motocicletas ($)', type: 'number' },
    { key: 'car_pickup', label: 'Autos / Pick-ups ($)', type: 'number' },
    { key: 'bus', label: 'Autobuses ($)', type: 'number' },
    { key: 'truck_4x', label: 'Camiones Pesados 4x ($)', type: 'number' },
    { key: 'truck_6x', label: 'Camiones Pesados 6x ($)', type: 'number' },
    { key: 'truck_9x', label: 'Camiones Pesados 9x ($)', type: 'number' },
    { key: 'eea', label: 'Eje Excedente Auto ($)', type: 'number' },
    { key: 'eec', label: 'Eje Excedente Camioneta ($)', type: 'number' },
    { key: 'isActive', label: 'Estado', type: 'boolean', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' } }
  ]
};
