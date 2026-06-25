import { PageControllerConfig } from '../../../../shared/components/master-detail/master-detail.interfaces';

export const PROJECT_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/projects',
  searchFields: ['name', 'code', 'oficial_name'],
  sortConfig: { key: 'code', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'PROJECTS'
  },
  
  tableColumns: [
    { key: 'code', label: 'Código/Clave' },
    { key: 'name', label: 'Nombre Proyecto' },
    { key: 'type', label: 'Tipo' },
    { key: 'CP', label: 'Año (CP)', align: 'center', width: 'w-24' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'name',
    subtitleField: 'oficial_name'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'code', label: 'Clave Presupuestal' },
    { key: 'name', label: 'Nombre Corto' },
    { key: 'oficial_name', label: 'Nombre Oficial Completo' },
    { key: 'type', label: 'Tipo de Proyecto' },
    { key: 'CP', label: 'Año de Ejecución (CP)' },
    { key: 'CA', label: 'Clave de Hacienda (CA)' },
    { key: 'FU', label: 'Finalidad y Función (FU)' },
    { key: 'SF', label: 'Subfunción (SF)' },
    { key: 'AI', label: 'Actividad Institucional (AI)' },
    { key: 'PT', label: 'Partida Genérica (PT)' },
    { 
      key: 'active', 
      label: 'Estado',
      type: 'boolean',
      booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' }
    }
  ]
};
