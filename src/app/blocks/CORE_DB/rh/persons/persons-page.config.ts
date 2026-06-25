import { PageControllerConfig } from '@app/shared/components/master-detail/master-detail.interfaces';

export const PERSONS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/rh/persons',
  tableColumns: [
    { key: 'fullName', label: 'Nombre Completo' },
    { key: 'curp', label: 'CURP' },
    { key: 'rfc', label: 'RFC' },
    { key: 'sexLabel', label: 'Sexo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'nickname', label: 'Alias' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  searchFields: ['name', 'first_surname', 'second_surname', 'curp', 'rfc', 'email', 'nickname'],
  cacheConfig: {
    enabled: true,
    key: 'PERSONS',
    ttlMinutes: 30
  },
  detailHeader: {
    titleField: 'fullName',
    subtitleField: 'nickname'
  },
  detailFields: [
    { key: 'curp', label: 'CURP' },
    { key: 'rfc', label: 'RFC' },
    { key: 'sexLabel', label: 'Sexo' },
    { key: 'birth_date', label: 'Fecha de Nacimiento' },
    { key: 'phone', label: 'Teléfono Celular' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'nickname', label: 'Alias / Nickname' }
  ]
};
