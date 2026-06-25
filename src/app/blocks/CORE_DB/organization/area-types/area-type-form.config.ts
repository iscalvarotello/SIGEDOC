import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';

export const AREA_TYPE_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/area-types',
  cacheKeyToInvalidate: 'AREA_TYPES',
  formConfig: [
    {
      title: 'Información Principal',
      subtitle: 'Defina el nombre y el nivel jerárquico de este tipo de área.',
      fields: [
        { 
          key: 'name', 
          label: 'Nombre del Tipo', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Coordinación, Dirección, Departamento...', 
          gridSpan: 2 
        },
        { 
          key: 'hierarchy_order', 
          label: 'Nivel Jerárquico', 
          type: 'number', 
          required: true, 
          placeholder: 'Ej. 1 (Más alto) a 10 (Más bajo)', 
          gridSpan: 1 
        },
        {
          key: 'index_sort',
          label: 'Orden Visual (Índice)',
          type: 'number',
          placeholder: 'Ej. 1',
          gridSpan: 1
        },
        {
          key: 'active',
          label: 'Activo',
          type: 'boolean',
          placeholder: '¿El tipo de área está en uso?',
          defaultValue: true,
          gridSpan: 2
        }
      ]
    }
  ]
};
