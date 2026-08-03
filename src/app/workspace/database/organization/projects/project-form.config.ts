import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const PROJECT_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/projects',
  cacheKeyToInvalidate: 'PROJECTS',
  formConfig: [
    {
      title: 'Datos Generales del Proyecto',
      subtitle: 'Defina los nombres y el tipo de proyecto institucional o de inversión.',
      fields: [
        { 
          key: 'name', 
          label: 'Nombre Corto / Coloquial', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Remodelación Parque', 
          gridSpan: 1 
        },
        { 
          key: 'code', 
          label: 'Clave Presupuestal', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. PROJ-2026-001', 
          gridSpan: 1 
        },
        { 
          key: 'oficial_name', 
          label: 'Nombre Oficial Completo', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Proyecto Integral de Remodelación del Parque Central...', 
          gridSpan: 2 
        },
        { 
          key: 'type', 
          label: 'Tipo de Proyecto', 
          type: 'enum', 
          required: true, 
          gridSpan: 1,
          options: [
            { label: 'Institucional', value: 'Institucional' },
            { label: 'De Inversión', value: 'de Inversión' }
          ]
        },
        { 
          key: 'CP', 
          label: 'Año de Ejecución (CP)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. 2026', 
          gridSpan: 1 
        },
        { 
          key: 'CA', 
          label: 'Clave de Hacienda (CA)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. HAC-123456', 
          gridSpan: 1 
        },
        { 
          key: 'FU', 
          label: 'Finalidad y Función (FU)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. FU-01', 
          gridSpan: 1 
        },
        { 
          key: 'SF', 
          label: 'Subfunción (SF)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. SF-02', 
          gridSpan: 1 
        },
        { 
          key: 'AI', 
          label: 'Actividad Institucional (AI)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. AI-03', 
          gridSpan: 1 
        },
        { 
          key: 'PT', 
          label: 'Partida Genérica (PT)', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. PT-04', 
          gridSpan: 1 
        },
        {
          key: 'active',
          label: 'Activo',
          type: 'boolean',
          defaultValue: true,
          gridSpan: 2
        }
      ]
    }
  ]
};
