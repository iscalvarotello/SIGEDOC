import { PageControllerConfig } from '../../../../shared/components/master-detail/master-detail.interfaces';

export const INTERNAL_TEMPLATE_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/security/internal-templates',
  searchFields: ['name', 'body', 'area_name'],
  sortConfig: { key: 'name', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'INTERNAL_TEMPLATES'
  },
  
  tableColumns: [
    { key: 'name', label: 'Nombre de la Plantilla' },
    { key: 'area_name', label: 'Área Asociada' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'area_name'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'name', label: 'Nombre' },
    { key: 'area_name', label: 'Área' },
    { key: 'body', label: 'Contenido / Cuerpo de la Plantilla', type: 'text' },
    { 
      key: 'active', 
      label: 'Estado',
      type: 'boolean',
      booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' }
    }
  ]
};
