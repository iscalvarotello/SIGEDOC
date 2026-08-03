import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const DOCUMENT_TEMPLATE_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/system/security/templates',
  searchFields: ['name', 'google_drive_id', 'type_doc_name', 'type_doc_code'],
  sortConfig: { key: 'index_order', direction: 'asc' },

  cacheConfig: {
    enabled: true,
    key: 'DOCUMENT_TEMPLATES',
    ttlMinutes: 30
  },

  tableColumns: [
    { key: 'index_order', label: 'Orden', width: 'w-16', align: 'center' },
    { key: 'name', label: 'Nombre' },
    { key: 'type_doc_name', label: 'Tipo de Documento' },
    { key: 'typeLabel', label: 'Tipo', width: 'w-32', align: 'center' },
    { key: 'active', label: 'Estado', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' }, width: 'w-24', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],

  detailHeader: {
    titleField: 'name',
    subtitleField: 'type_doc_name',
    subtitleLabel: 'Documento'
  },

  detailFields: [
    { key: 'id', label: 'ID de Plantilla' },
    { key: 'name', label: 'Nombre de Plantilla' },
    { key: 'google_drive_id', label: 'ID de Google Drive' },
    { key: 'url', label: 'Enlace en Drive', type: 'link', linkBuilder: (data: any) => data.url || '' },
    { key: 'typeLabel', label: 'Tipo de Plantilla' },
    { key: 'type_doc_name', label: 'Tipo de Documento Asociado' },
    { key: 'owner_name', label: 'Área Propietaria (Owner)' },
    { key: 'index_order', label: 'Índice de Ordenamiento', prefix: '#' },
    { key: 'active', label: 'Estado Habilitado', type: 'boolean', booleanLabels: { trueLabel: 'Habilitado (Activo) 🟢', falseLabel: 'Deshabilitado (Inactivo) 🔴' } }
  ]
};
