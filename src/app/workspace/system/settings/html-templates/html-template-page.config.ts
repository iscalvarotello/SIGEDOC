import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const HTML_TEMPLATE_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/system/settings/html-templates',
  searchFields: ['name'],
  sortConfig: { key: 'name', direction: 'asc' },

  cacheConfig: {
    enabled: true,
    key: 'HTML_TEMPLATES',
    ttlMinutes: 30
  },

  tableColumns: [
    { key: 'name', label: 'Nombre de la Plantilla' },
    { key: 'document_class', label: 'Tipo de Documento', width: 'w-40' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],

  detailHeader: {
    titleField: 'name',
    subtitleLabel: 'Plantilla HTML'
  },

  detailFields: [
    { key: 'id', label: 'ID de Plantilla' },
    { key: 'document_class', label: 'Tipo de Documento' }
  ]
};
