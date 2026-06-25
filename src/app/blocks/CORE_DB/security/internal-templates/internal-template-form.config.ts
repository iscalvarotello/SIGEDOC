import { FormControllerConfig } from '../../../../shared/interfaces/dynamic-form.interface';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';

export const INTERNAL_TEMPLATE_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/security/internal-templates',
  cacheKeyToInvalidate: 'INTERNAL_TEMPLATES',
  formConfig: [
    {
      title: 'Información de la Plantilla Interna',
      subtitle: 'Defina el nombre, el área asociada y el contenido de la plantilla.',
      fields: [
        { 
          key: 'name', 
          label: 'Nombre de la Plantilla', 
          type: 'text', 
          required: true, 
          placeholder: 'Ej. Formato de Oficio de Comisión', 
          gridSpan: 2 
        },
        { 
          key: 'area_id', 
          label: 'Área Asociada (Opcional - Vacío para Global/Todas)', 
          type: 'api-select', 
          required: false, 
          apiConfig: { 
            configKey: ENDPOINT_KEYS.AREAS, 
            valueKey: 'id', 
            labelKey: 'name' 
          }, 
          placeholder: 'Seleccione el Área de uso', 
          gridSpan: 2 
        },
        { 
          key: 'body', 
          label: 'Contenido / Cuerpo (Texto)', 
          type: 'textarea', 
          required: true, 
          placeholder: 'Escriba el contenido base de la plantilla aquí. Puede incluir variables como {{__proyect_name__}}, {{__supplier_name__}}, etc.', 
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
