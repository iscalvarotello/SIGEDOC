import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';

export const AREA_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/areas',
  cacheKeyToInvalidate: 'AREAS',
  formConfig: [
    {
      title: 'Información General',
      subtitle: 'Datos principales del área administrativa',
      fields: [
        { key: 'name', label: 'Nombre del Área', type: 'text', required: true, placeholder: 'Ej. Economía y del Trabajo', gridSpan: 2 },
        { key: 'acronym', label: 'Acrónimo', type: 'text', placeholder: 'Ej. SEYT', gridSpan: 1 },
        { key: 'connector', label: 'Conector', type: 'text', placeholder: 'Ej. de, del, de la...', gridSpan: 1 },
        { 
          key: 'header', 
          label: 'Encabezado Oficial', 
          type: 'text', 
          placeholder: 'Ej. Oficina del C. Secretario', 
          gridSpan: 2 
        }
      ]
    },
    {
      title: 'Estructura Jerárquica y Ubicación',
      subtitle: 'Defina a quién reporta y dónde se ubica físicamente',
      fields: [
        { key: 'area_type_id', label: 'Tipo de Área', type: 'api-select', required: true, apiConfig: { configKey: ENDPOINT_KEYS.AREA_TYPES, valueKey: 'id', labelKey: 'name' }, placeholder: 'Seleccione un Tipo de Área', gridSpan: 1 },
        { key: 'parent_id', label: 'Área Padre (Depende de)', type: 'api-select', apiConfig: { configKey: ENDPOINT_KEYS.AREAS, valueKey: 'id', labelKey: (item: any) => { const typeName = item.area_type && typeof item.area_type === 'object' ? item.area_type.name : item.area_type; const full = [typeName, item.connector, item.name].filter(Boolean).join(' '); return item.acronym ? `${full} (${item.acronym})` : full; } }, placeholder: 'Seleccione el Área a la que reporta', gridSpan: 1 },
        { key: 'branch_id', label: 'Sede Física', type: 'api-select', required: true, apiConfig: { configKey: ENDPOINT_KEYS.BRANCHES, valueKey: 'id', labelKey: 'name' }, placeholder: 'Seleccione la sede donde opera', gridSpan: 2 }
      ]
    },
    {
      title: 'Configuración Adicional',
      fields: [
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
          placeholder: '¿El área está en operaciones?',
          defaultValue: true,
          gridSpan: 1
        }
      ]
    }
  ]
};
