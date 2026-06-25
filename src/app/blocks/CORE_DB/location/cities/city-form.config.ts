import { FormControllerConfig } from '../../../../shared/interfaces/dynamic-form.interface';

export const CITY_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/location/cities',
  cacheKeyToInvalidate: 'CITIES',
  
  formConfig: [
    {
      title: 'Datos Generales',
      fields: [
        { key: 'city', label: 'Nombre de la Ciudad', type: 'text', required: true, placeholder: 'Ej. Tuxtla Gutiérrez', gridSpan: 2 },
        {
          key: 'country_id',
          label: 'ID del País',
          type: 'hidden',
          hideOnCreate: true,
          hideOnEdit: true
        },
        {
          key: 'state_id',
          label: 'ID del Estado',
          type: 'hidden',
          hideOnCreate: true,
          hideOnEdit: true
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
