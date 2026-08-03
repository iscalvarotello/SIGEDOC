import { PageControllerConfig } from '@system-shared/master-detail/master-detail.interfaces';

export const USUARIOS_PAGE_CONFIG: PageControllerConfig = {
  mainRoute: '/system/security/users',
  tableColumns: [
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'backendRoleLabel', label: 'Acceso Backend' },
    { key: 'systemRoleLabel', label: 'Rol de Sistema' },
    { key: 'fullName', label: 'Colaborador Asociado' },
    { key: 'resolvedAreaName', label: 'Área Administrativa' },
    { key: 'activeLabel', label: 'Estatus' },
    { key: 'actions', label: 'Acciones', align: 'right', isAction: true, width: 'w-24' }
  ],
  searchFields: ['email', 'backend_role', 'name', 'first_surname', 'second_surname', 'area_name', 'area_base_name', 'system_role_name'],
  cacheConfig: {
    enabled: true,
    key: 'USERS',
    ttlMinutes: 10
  },
  detailHeader: {
    titleField: 'email',
    subtitleField: 'systemRoleLabel'
  },
  detailFields: [
    { key: 'fullName', label: 'Colaborador' },
    { key: 'backendRoleLabel', label: 'Rol de Consola/Backend' },
    { key: 'systemRoleLabel', label: 'Rol de Sistema (Permisos)' },
    { key: 'resolvedAreaName', label: 'Área' },
    { key: 'organizationalRolesLabel', label: 'Roles Operativos' },
    { key: 'activeLabel', label: 'Estado de Cuenta' }
  ]
};
