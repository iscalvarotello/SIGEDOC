import { ColumnConfig, HeaderConfig, FieldConfig, PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const INSTITUTION_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/institutions',
  tableColumns: [
    { key: 'logo', label: '', type: 'image', imageEndpointKey: 'INSTITUTIONS', imageRouteKey: 'getLogo' } as ColumnConfig,
    { key: 'acronym', label: 'Acrónimo', type: 'text', truncate: true } as ColumnConfig,
    { key: 'name', label: 'Nombre Institucional', type: 'text', truncate: true } as ColumnConfig,
    { key: 'level', label: 'Nivel', type: 'text' } as ColumnConfig
  ],
  detailHeader: {
    titleField: 'name',
    subtitleField: 'acronym',
    icon: 'Organizacion'
  } as HeaderConfig,
  detailFields: [
    { key: 'level', label: 'Nivel Institucional', type: 'text', icon: 'Organizacion' } as FieldConfig,
    { key: 'main_branch_id', label: 'Sucursal Matriz', type: 'text', icon: 'MapPin' } as FieldConfig
  ],
  searchFields: ['name', 'acronym', 'level'],
  sortConfig: { key: 'name', direction: 'asc' }
};
