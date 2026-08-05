import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const EXTERNAL_CONTACT_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/external-contacts',
  formConfig: [
    {
      title: 'Información General',
      fields: [
        { key: 'nombre', label: 'Nombre o Título Oficial', type: 'text', required: true, placeholder: 'Ej. Juan Pérez / Secretaría de Economía', gridSpan: 2 } ,
        { key: 'empresa_dependencia', label: 'Dependencia / Empresa', type: 'text', placeholder: 'Ej. SRE / Microsoft', gridSpan: 2 },
        { key: 'puesto', label: 'Puesto', type: 'text', placeholder: 'Ej. Director General', gridSpan: 2 },
        { key: 'tipo_entidad', label: 'Tipo de Entidad', type: 'enum',
             options: [
                  { value: 'particular', label: 'Particular' },
                  { value: 'gubernamental', label: 'Gubernamental' },
                  { value: 'empresa', label: 'Empresa / Privado' },
                  { value: 'institucion_educativa', label: 'Institución Educativa' }
                ],
          gridSpan: 1
        },
        { key: 'nivel_gobierno', label: 'Nivel de Gobierno',  type: 'enum',
          options: [
                { value: '', label: 'N/A' },
                { value: 'federal', label: 'Federal' },
                { value: 'estatal', label: 'Estatal' },
                { value: 'municipal', label: 'Municipal' }
            ],
          gridSpan: 1
        }
      ]
    },
    {
      title: 'Contacto',
      fields: [
        { key: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ej. 555-1234-567', gridSpan: 1 } ,
        { key: 'email', label: 'Correo Electrónico', type: 'text', placeholder: 'Ej. contacto@empresa.com', gridSpan: 1 } ,
        { key: 'curp', label: 'CURP', type: 'text', placeholder: 'Ej. ABCD123456EFGHIJ01', gridSpan: 1 }
      ]
    }
  ]
};