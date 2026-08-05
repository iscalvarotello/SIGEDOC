import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';
import { ExternalContactDTO } from './external-contact.dto';

export const EXTERNAL_CONTACT_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/database/organization/external-contacts',
  tableColumns: [
    { label: 'Nombre', key: 'nombre', width: 'flex-1' },
    { label: 'Dependencia/Empresa', key: 'empresa_dependencia', width: 'flex-1' },
    { label: 'Tipo', key: 'tipo_entidad', width: 'w-32' },
    { label: 'Nivel', key: 'nivel_gobierno', width: 'w-32' },
    { label: 'Acciones', key: 'actions', width: 'w-24', align: 'right', isAction: true }
  ],
  detailHeader: {
    titleField: 'nombre',
    subtitleField: 'empresa_dependencia'
  },
  detailFields: [
    { label: 'Puesto', key: 'puesto' },
    { label: 'Dependencia/Empresa', key: 'empresa_dependencia' },
    { label: 'Tipo de Entidad', key: 'tipo_entidad' },
    { label: 'Nivel de Gobierno', key: 'nivel_gobierno' },
    { label: 'Teléfono', key: 'telefono' },
    { label: 'Correo Electrónico', key: 'email' },
    { label: 'CURP', key: 'curp' }
  ]
};
