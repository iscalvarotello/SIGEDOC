import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const PARTIDA_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/partidas',
  cacheKeyToInvalidate: 'PARTIDAS',
  formConfig: [
    {
      title: 'Datos de la Partida Presupuestal',
      subtitle: 'Defina la clave y descripción de la partida presupuestal.',
      fields: [
        { 
          key: 'partida', 
          label: 'Clave de Partida', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. 38301', 
          gridSpan: 1 
        },
        { 
          key: 'descripcion', 
          label: 'Descripción de la Partida', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Congresos y Convenciones', 
          gridSpan: 2 
        },
        {
          key: 'active',
          label: 'Activa',
          type: 'boolean',
          defaultValue: true,
          gridSpan: 2
        }
      ]
    }
  ]
};
