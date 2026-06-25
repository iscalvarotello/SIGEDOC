import { FormGroupConfig } from '@app/shared/interfaces/dynamic-form.interface';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';

export const DOCUMENT_TEMPLATE_FORM_CONFIG: FormGroupConfig[] = [
  {
    title: 'Información Básica de la Plantilla',
    subtitle: 'Registra el nombre descriptivo y los identificadores de Google Drive.',
    fields: [
      { key: 'name', label: 'Nombre de la Plantilla', type: 'text', required: true, placeholder: 'Ej. Plantilla de Oficio Base', gridSpan: 1 },
      { key: 'google_drive_id', label: 'ID de Archivo en Google Drive', type: 'text', required: true, placeholder: 'Ej. 1sBVpGVEWOveSyQ8...', gridSpan: 1 },
      { key: 'url', label: 'URL de Documento en Drive (opcional)', type: 'text', placeholder: 'Ej. https://docs.google.com/document/d/...', gridSpan: 2 }
    ]
  },
  {
    title: 'Asignación y Clasificación',
    subtitle: 'Vincula la plantilla con el catálogo de tipos de documento y establece su jerarquía.',
    fields: [
      { key: 'document_type_catalog_id', label: 'Tipo de Documento', type: 'api-select', required: true, apiConfig: { configKey: ENDPOINT_KEYS.DOCUMENT_TYPE_CATALOGS, valueKey: 'id', labelKey: 'name' }, placeholder: 'Seleccione un Tipo de Documento...', gridSpan: 1 },
      { key: 'type', label: 'Tipo de Plantilla', type: 'enum', options: [
          { value: 'blank', label: 'En Blanco' },
          { value: 'custom', label: 'Personalizada' }
        ], required: true, gridSpan: 1 },
      { key: 'owner_id', label: 'Área Propietaria (Owner - opcional)', type: 'api-select', apiConfig: { configKey: ENDPOINT_KEYS.AREAS, valueKey: 'id', labelKey: 'name' }, placeholder: 'Seleccione el área propietaria...', gridSpan: 1 },
      { key: 'index_order', label: 'Índice de Ordenamiento', type: 'number', placeholder: 'Ej. 1 (dejar vacío para null)', gridSpan: 1 },
      { key: 'active', label: '¿Habilitado para su Uso?', type: 'boolean', defaultValue: true, gridSpan: 2 }
    ]
  }
];
