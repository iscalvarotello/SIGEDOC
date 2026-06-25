import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';

export const OFFICIAL_RECIPIENT_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/official-recipients',
  cacheKeyToInvalidate: 'OFFICIAL_RECIPIENTS',
  formConfig: [
    {
      title: 'Datos del Destinatario Oficial',
      subtitle: 'Ingrese la información personal y cargo de la persona.',
      fields: [
        { 
          key: 'nombre', 
          label: 'Nombre Completo', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Manuel Francisco Antonio Pariente Gavito', 
          gridSpan: 2 
        },
        { 
          key: 'puesto', 
          label: 'Puesto / Cargo', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Secretario', 
          gridSpan: 1 
        },
        { 
          key: 'empresa_dependencia', 
          label: 'Empresa o Dependencia', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Secretaría de Finanzas', 
          gridSpan: 1 
        }
      ]
    },
    {
      title: 'Datos de Contacto',
      subtitle: 'Ingrese los medios de contacto de la persona.',
      fields: [
        { 
          key: 'telefono', 
          label: 'Teléfono', 
          type: 'text', 
          required: false, 
          placeholder: 'Ej. (961) 69 1 40 43 Ext. 65015', 
          gridSpan: 1 
        },
        { 
          key: 'email', 
          label: 'Correo Electrónico', 
          type: 'email', 
          required: false, 
          placeholder: 'Ej. mpariente@finanzaschiapas.gob.mx', 
          gridSpan: 1 
        }
      ]
    }
  ]
};
