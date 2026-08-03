import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const CITY_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/location/cities',
  cacheKeyToInvalidate: 'CITIES',
  keysToOmitOnSubmit: ['country_id'],
  
  formConfig: [
    {
      title: 'Datos Generales',
      fields: [
        { key: 'city', label: 'Nombre de la Ciudad', type: 'text', required: true, placeholder: 'Ej. Tuxtla Gutiérrez', gridSpan: 2 },
        {
          key: 'country_id',
          label: 'País (Filtro)',
          type: 'country-select',
          gridSpan: 1
        },
        {
          key: 'state_id',
          label: 'Estado de Pertenencia',
          type: 'state-select',
          required: true,
          gridSpan: 1
        },
        {
          key: 'latitude',
          label: 'Latitud',
          type: 'text',
          placeholder: 'Ej. 16.756',
          gridSpan: 1
        },
        {
          key: 'longitude',
          label: 'Longitud',
          type: 'text',
          placeholder: 'Ej. -93.129',
          gridSpan: 1
        }
      ]
    }
  ]
};
