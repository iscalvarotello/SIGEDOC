import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const OFFICIAL_RECIPIENT_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/official-recipients',
  searchFields: ['nombre', 'puesto', 'empresa_dependencia', 'telefono', 'email'],
  sortConfig: { key: 'nombre', direction: 'asc' },
  
  cacheConfig: {
    enabled: true,
    key: 'OFFICIAL_RECIPIENTS'
  },
  
  tableColumns: [
    { key: 'nombre', label: 'Nombre Completo' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'curp', label: 'CURP' },
    { key: 'empresa_dependencia', label: 'Dependencia/Empresa' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  
  detailHeader: {
    titleField: 'nombre',
    subtitleField: 'puesto'
  },
  
  detailFields: [
    { key: 'id', label: 'ID del Sistema' },
    { key: 'nombre', label: 'Nombre Completo' },
    { key: 'puesto', label: 'Puesto o Cargo' },
    { key: 'curp', label: 'CURP' },
    { key: 'empresa_dependencia', label: 'Empresa o Dependencia' },
    { key: 'telefono', label: 'Teléfono de Contacto' },
    { key: 'email', label: 'Correo Electrónico' }
  ]
};
