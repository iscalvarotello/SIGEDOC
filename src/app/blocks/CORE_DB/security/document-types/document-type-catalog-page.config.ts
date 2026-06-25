import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';
import { DOCUMENT_TYPE_OPTIONS } from './document-type.enum';

export const DOCUMENT_TYPE_CATALOG_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/security/document-types',
  searchFields: ['code', 'name'],
  sortConfig: { key: 'index_order', direction: 'asc' },

  cacheConfig: {
    enabled: true,
    key: 'DOCUMENT_TYPE_CATALOGS',
    ttlMinutes: 30
  },

  tableColumns: [
    { key: 'index_order', label: 'Orden', width: 'w-16', align: 'center' },
    { key: 'code', label: 'Código de Sistema', width: 'w-1/3' },
    { key: 'name', label: 'Nombre Descriptivo' },
    { key: 'active', label: 'Estado', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' }, width: 'w-24', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],

  detailHeader: {
    titleField: 'name',
    subtitleField: 'code',
    subtitleLabel: 'Código'
  },

  detailFields: [
    { key: 'id', label: 'ID del Registro' },
    { key: 'code', label: 'Código en Sistema', type: 'enum', options: DOCUMENT_TYPE_OPTIONS },
    { key: 'name', label: 'Nombre Legible' },
    { key: 'index_order', label: 'Índice de Ordenamiento', prefix: '#' },
    { key: 'active', label: 'Estado Habilitado', type: 'boolean', booleanLabels: { trueLabel: 'Habilitado (Activo) 🟢', falseLabel: 'Deshabilitado (Inactivo) 🔴' } }
  ]
};
