import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';

export const BRANCH_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/branches',
  cacheKeyToInvalidate: 'BRANCHES',
  formConfig: [
    {
      title: 'Ubicación Geográfica',
      subtitle: 'Seleccione la ciudad donde se ubica esta Sede Física.',
      fields: [
        {
          key: 'country_id',
          label: 'ID País',
          type: 'hidden',
          hideOnCreate: true,
          hideOnEdit: true
        },
        {
          key: 'state_id',
          label: 'ID Estado',
          type: 'hidden',
          hideOnCreate: true,
          hideOnEdit: true
        },
        {
          key: 'city_id',
          label: 'Filtro de Ubicación',
          type: 'custom',
          customTypeKey: 'LOCATION_FILTER',
          customProps: {
            layout: 'vertical'
          },
          required: true,
          gridSpan: 2
        }
      ]
    },
    {
      title: 'Datos Generales de la Sede',
      fields: [
        { 
          key: 'name', 
          label: 'Nombre de la Sede', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Anexo Torre Chiapas, Nivel 1', 
          gridSpan: 2 
        },
        { 
          key: 'address', 
          label: 'Dirección Completa', 
          type: 'text', 
          required: true, 
          placeholder: 'Calle, Número, Colonia, C.P.', 
          gridSpan: 2 
        },
        {
          key: 'is_central',
          label: 'Sede Central',
          type: 'boolean',
          placeholder: '¿Es la oficina central?',
          defaultValue: false,
          gridSpan: 1
        },
        {
          key: 'active',
          label: 'Activo',
          type: 'boolean',
          placeholder: '¿Se encuentra en operaciones?',
          defaultValue: true,
          gridSpan: 1
        },
        {
          key: 'index_sort',
          label: 'Orden (Índice)',
          type: 'number',
          placeholder: 'Ej. 1',
          gridSpan: 1
        }
      ]
    }
  ]
};
