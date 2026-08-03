import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const TOLL_BOOTH_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/logistic/toll-booths',
  cacheKeyToInvalidate: 'TOLL_BOOTHS',
  formConfig: [
    {
      title: 'Información General',
      fields: [
        { key: 'name', label: 'Nombre de la Caseta', type: 'text', required: true, gridSpan: 2 },
        { key: 'isActive', label: 'Estado (Activo)', type: 'boolean', defaultValue: true, gridSpan: 1 },
        { key: 'index_sort', label: 'Orden Personalizado', type: 'number', gridSpan: 1 }
      ]
    },
    {
      title: 'Costos Vehículos Ligeros y Autobuses',
      fields: [
        { key: 'moto', label: 'Motocicleta ($)', type: 'number', required: true, gridSpan: 1 },
        { key: 'car_pickup', label: 'Auto / Pick-up ($)', type: 'number', required: true, gridSpan: 1 },
        { key: 'bus', label: 'Autobuses 2 y 4 Ejes ($)', type: 'number', required: true, gridSpan: 2 }
      ]
    },
    {
      title: 'Costos Vehículos Pesados',
      fields: [
        { key: 'truck_4x', label: 'Camiones Pesados 2 y 4 Ejes ($)', type: 'number', required: true, gridSpan: 1 },
        { key: 'truck_6x', label: 'Camiones Pesados 5 y 6 Ejes ($)', type: 'number', required: true, gridSpan: 1 },
        { key: 'truck_9x', label: 'Camiones Pesados 7 y 9 Ejes ($)', type: 'number', required: true, gridSpan: 2 }
      ]
    },
    {
      title: 'Ejes Excedentes',
      fields: [
        { key: 'eea', label: 'Eje Excedente Automóvil ($)', type: 'number', required: true, defaultValue: 0, gridSpan: 1 },
        { key: 'eec', label: 'Eje Excedente Camioneta/Camión ($)', type: 'number', required: true, defaultValue: 0, gridSpan: 1 }
      ]
    }
  ]
};
