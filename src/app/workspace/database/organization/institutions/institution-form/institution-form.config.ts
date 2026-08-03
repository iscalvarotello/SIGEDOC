import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const INSTITUTION_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/institutions',
  cacheKeyToInvalidate: 'INSTITUTIONS',
  formConfig: [
    {
      title: 'Datos Generales',
      subtitle: 'Información principal de la Institución o Dependencia',
      fields: [
        { 
          key: 'name', 
          label: 'Nombre Institucional', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Secretaría de Economía y del Trabajo', 
          gridSpan: 2 
        },
        { 
          key: 'acronym', 
          label: 'Acrónimo / Siglas', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. SEC', 
          gridSpan: 1 
        },
        {
          key: 'level',
          label: 'Nivel Institucional',
          type: 'enum',
          options: [
            { label: 'Municipal', value: 'Municipal' },
            { label: 'Estatal', value: 'Estatal' },
            { label: 'Federal', value: 'Federal' },
            { label: 'Privado', value: 'Privado' }
          ],
          required: true,
          gridSpan: 1
        }
      ]
    },
    {
      title: 'Jerarquía Operativa',
      subtitle: 'Defina la sucursal matriz de esta institución.',
      fields: [
        {
          key: 'main_branch_id',
          label: 'Sucursal Madre (Matriz)',
          type: 'api-select',
          apiConfig: {
            configKey: 'branches',
            valueKey: 'id',
            labelKey: 'name'
          },
          required: false,
          gridSpan: 2
        }
      ]
    }
  ]
};
