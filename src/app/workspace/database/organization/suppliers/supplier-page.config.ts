import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const SUPPLIER_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/suppliers',
  // Configuración de Tabla
  tableColumns: [
    { key: 'name', label: 'Nombre Comercial' },
    { key: 'razon_social', label: 'Razón Social' },
    { key: 'rfc', label: 'RFC' },
    { key: 'type', label: 'Tipo' },
    { key: 'telephone', label: 'Teléfono' },
    { key: 'active', label: 'Estatus' },
    { key: 'index_sort', label: 'Orden', align: 'center', width: 'w-20' }
  ],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  searchFields: ['name', 'razon_social', 'rfc', 'telephone'],
  
  // Configuración de Caché
  cacheConfig: {
    enabled: true,
    key: 'SUPPLIERS',
    ttlMinutes: 30
  },

  // Configuración del Visor de Detalles (DetailViewer)
  detailHeader: {
    titleField: 'name',
    subtitleField: 'razon_social'
  },
  detailFields: [
    { key: 'rfc', label: 'RFC' },
    { key: 'type', label: 'Tipo de Proveedor' },
    { key: 'telephone', label: 'Teléfono' },
    { key: 'index_sort', label: 'Orden' }
  ]
};
