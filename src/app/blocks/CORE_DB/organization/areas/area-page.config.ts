import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';

export const AREA_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/areas',
  searchFields: ['name', 'acronym', 'header'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'AREAS'
  },
  
  tableColumns: [
    { key: 'full_name'  , label: 'Área'                                                        } ,
    { key: 'acronym'    , label: 'Acrónimo' , width: 'w-24'                                    } ,
    { key: 'index_sort' , label: 'Orden'    , width: 'w-20' , align: 'center',                 } ,
    { key: 'actions'    , label: 'Acciones' , width: 'w-24' , align: 'right', isAction: true,  }
  ],
  
  detailHeader: {
    titleField    : 'header'    ,
    subtitleField : 'area_type'
  },
  
  detailFields: [
    { key: 'name'        , label: 'Nombre del Área'         } ,
    { key: 'acronym'     , label: 'Acrónimo'                } ,
    { key: 'connector'   , label: 'Conector (de, del)'      } ,
    { key: 'header'      , label: 'Encabezado Oficial'      } ,
    { key: 'parent_name' , label: 'Área Padre (Depende de)' } ,
    { key: 'index_sort'  , label: 'Índice de Ordenamiento'  } ,
    { key: 'active'      , label: 'Estado', type: 'boolean', booleanLabels: { trueLabel: 'Activo', falseLabel: 'Inactivo' } },
    { key: 'branch'      , label: 'Sede Física'             } ,
    { key: 'city'        , label: 'Ciudad'                  } ,
    { key: 'state'       , label: 'Estado'                  } ,
    { key: 'country'     , label: 'País'                    } ,
  ]
};
