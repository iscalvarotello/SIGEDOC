import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const JOB_POSITION_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/rh/job-positions',
  cacheKeyToInvalidate: 'JOB_POSITIONS',
  formConfig: [
    {
      title: 'Identificación del Puesto',
      subtitle: 'Ingresa los nombres oficiales en masculino, femenino y plural.',
      fields: [
        {
          key: 'name',
          type: 'text',
          label: 'Nombre del Puesto (Masculino)',
          placeholder: 'Ej. Secretario técnico, Jefe de Departamento...',
          required: true,
          gridSpan: 2
        },
        {
          key: 'name_fem',
          type: 'text',
          label: 'Nombre del Puesto (Femenino)',
          placeholder: 'Ej. Secretaria técnica, Jefa de Departamento...',
          required: false,
          gridSpan: 1
        },
        {
          key: 'name_plural',
          type: 'text',
          label: 'Nombre del Puesto (Plural)',
          placeholder: 'Ej. Secretarios técnicos, Jefes de Departamento...',
          required: false,
          gridSpan: 1
        },
        {
          key: 'job_key',
          type: 'text',
          label: 'Clave Hacienda',
          placeholder: 'Ej. 110201',
          required: false,
          gridSpan: 1
        },
        {
          key: 'category',
          type: 'text',
          label: 'Categoría oficial',
          placeholder: 'Ej. MANDO MEDIO SUPERIOR',
          required: false,
          gridSpan: 1
        },
        {
          key: 'level',
          type: 'enum',
          label: 'Nivel Jerárquico',
          placeholder: 'Seleccione un nivel...',
          options: [
            { label: 'Nivel A', value: 'A' },
            { label: 'Nivel B', value: 'B' },
            { label: 'Nivel C', value: 'C' },
            { label: 'Nivel D', value: 'D' },
            { label: 'Nivel E', value: 'E' }
          ],
          required: false,
          gridSpan: 1
        },
        {
          key: 'index_sort',
          type: 'number',
          label: 'Orden de Visualización',
          placeholder: 'Ej. 1',
          required: false,
          gridSpan: 1
        }
      ]
    },
    {
      title: 'Conectores gramaticales y Jerarquía',
      subtitle: 'Configura las reglas de redacción y nivel de autoridad.',
      fields: [
        {
          key: 'principal',
          type: 'boolean',
          label: '¿Es puesto de autoridad (Jefe de área)?',
          placeholder: 'Activar si representa al titular del área',
          required: false,
          defaultValue: false,
          gridSpan: 1
        },
        {
          key: 'active',
          type: 'boolean',
          label: '¿Puesto activo?',
          placeholder: 'Habilitado en el catálogo',
          required: false,
          defaultValue: true,
          gridSpan: 1
        },
        {
          key: 'connector',
          type: 'text',
          label: 'Conector gramatical alternativo',
          placeholder: 'Ej. de la, del (Solo si difiere del conector normal del área)',
          required: false,
          gridSpan: 2
        },
        {
          key: 'job_connector',
          type: 'text',
          label: 'Conector Masculino Corto',
          placeholder: 'Ej. Jefe (Para Jefe de Departamento -> Jefe del Departamento de...)',
          required: false,
          gridSpan: 1
        },
        {
          key: 'job_connector_fem',
          type: 'text',
          label: 'Conector Femenino Corto',
          placeholder: 'Ej. Jefa (Para Jefa de Departamento -> Jefa del Departamento de...)',
          required: false,
          gridSpan: 1
        }
      ]
    }
  ]
};
