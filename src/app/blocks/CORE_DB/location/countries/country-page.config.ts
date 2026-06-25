import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';
import { CountryDTO, COUNTRY_REGIONS } from './country.dto';

export const COUNTRY_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/location/countries',
  searchFields: ['name', 'fullName', 'iso2', 'iso3', 'phonecode'],
  sortConfig: { key: 'index_sort', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'COUNTRIES',
    ttlMinutes: 60 // 1 hora de caché por defecto para países
  },
  
  tableColumns: [
    { key: 'emoji', label: 'Bandera', width: 'w-16', align: 'center' },
    { key: 'fullName', label: 'País' },
    { key: 'phonecode', label: 'Prefijo', align: 'center' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    emojiField: 'emoji',
    titleField: 'fullName',
    subtitleField: 'id',
    subtitleLabel: 'ID'
  },
  
  detailFields: [
    { key: 'phonecode', label: 'Prefijo Telefónico', prefix: '+' },
    { key: 'region', label: 'Región Global', type: 'enum', options: COUNTRY_REGIONS },
    { key: 'zone', label: 'Zona Económica' },
    { key: 'fix', label: '¿País Predeterminado?', type: 'boolean',  booleanLabels: { trueLabel: '⭐ Si', falseLabel: 'No' }},
    { key: 'index_country', label: 'Índice Sistema', prefix: '#' },
    { key: 'index_sort', label: 'Índice Orden', prefix: '#' }
  ]
};
