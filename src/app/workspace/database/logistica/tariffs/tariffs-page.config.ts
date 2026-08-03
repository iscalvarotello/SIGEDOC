import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const TARIFFS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/logistic/tariffs',
  tableType: 'matrix-table',
  cacheConfig: {
    enabled: true,
    key: 'TARIFFS',
    ttlMinutes: 60
  },
  
  // Sigue existiendo tableColumns por compatibilidad con la interfaz
  tableColumns: [],

  // Configuración Exclusiva para Matrix Table
  matrixGroups: [
    {
      title: 'Datos Generales',
      columns: [
        { key: 'employ_category', label: 'Categoría', align: 'center', width: 'w-16' },
        { key: 'travel_scope', label: 'Alcance', width: 'w-24' },
        //{ key: 'year', label: 'Año', align: 'center', width: 'w-16' },
        { key: 'currency', label: 'Moneda', align: 'center', width: 'w-16' }
      ]
    },
    {
      title: 'Zona A',
      columns: [
        { key: 'zone_A_full_day', label: 'Completo', type: 'currency', align: 'right', width: 'w-24' },
        { key: 'zone_A_middle_day', label: 'Medio', type: 'currency', align: 'right', width: 'w-24' }
      ]
    },
    {
      title: 'Zona B',
      columns: [
        { key: 'zone_B_full_day', label: 'Completo', type: 'currency', align: 'right', width: 'w-24' },
        { key: 'zone_B_middle_day', label: 'Medio', type: 'currency', align: 'right', width: 'w-24' }
      ]
    },
    {
      title: 'Zona C',
      columns: [
        { key: 'zone_C_full_day', label: 'Completo', type: 'currency', align: 'right', width: 'w-24' },
        { key: 'zone_C_middle_day', label: 'Medio', type: 'currency', align: 'right', width: 'w-24' }
      ]
    }
  ],
  
  detailHeader: {
    titleField: 'name' // defined in DTO
  },
  
  detailFields: [
    { key: 'employ_category', label: 'Categoría', type: 'text' },
    { key: 'travel_scope', label: 'Alcance', type: 'text' },
    { key: 'year', label: 'Año de Aplicación', type: 'number' },
    { key: 'currency', label: 'Moneda de Pago', type: 'text' },
    { key: 'zone_A_full_day', label: 'Zona A - Día Completo', type: 'number' },
    { key: 'zone_A_middle_day', label: 'Zona A - Medio Día', type: 'number' },
    { key: 'zone_B_full_day', label: 'Zona B - Día Completo', type: 'number' },
    { key: 'zone_B_middle_day', label: 'Zona B - Medio Día', type: 'number' },
    { key: 'zone_C_full_day', label: 'Zona C - Día Completo', type: 'number' },
    { key: 'zone_C_middle_day', label: 'Zona C - Medio Día', type: 'number' }
  ]
};
