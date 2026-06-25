import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';

export const JOB_POSITIONS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/rh/job-positions',
  tableColumns: [
    { key: 'name', label: 'Nombre Puesto (M)' },
    { key: 'name_fem', label: 'Nombre Puesto (F)' },
    { key: 'job_key', label: 'Clave Oficial' },
    { key: 'category', label: 'Categoría' },
    { key: 'level', label: 'Nivel', align: 'center' },
    { key: 'principalLabel', label: 'Rol' },
    { key: 'activeLabel', label: 'Estatus' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  searchFields: ['name', 'name_fem', 'name_plural', 'job_key', 'category', 'level'],
  cacheConfig: {
    enabled: true,
    key: 'JOB_POSITIONS',
    ttlMinutes: 30
  },
  detailHeader: {
    titleField: 'name',
    subtitleField: 'category'
  },
  detailFields: [
    { key: 'name', label: 'Nombre (Masculino)' },
    { key: 'name_fem', label: 'Nombre (Femenino)' },
    { key: 'name_plural', label: 'Nombre (Plural)' },
    { key: 'job_key', label: 'Clave Oficial (Hacienda)' },
    { key: 'category', label: 'Categoría de Adscripción' },
    { key: 'level', label: 'Nivel Jerárquico' },
    { key: 'connector', label: 'Conector de Área' },
    { key: 'job_connector', label: 'Título Corto (M)' },
    { key: 'job_connector_fem', label: 'Título Corto (F)' },
    { key: 'principalLabel', label: 'Tipo de Puesto' },
    { key: 'activeLabel', label: 'Estatus del Catálogo' },
    { key: 'index_sort', label: 'Orden de Visualización' }
  ]
};
