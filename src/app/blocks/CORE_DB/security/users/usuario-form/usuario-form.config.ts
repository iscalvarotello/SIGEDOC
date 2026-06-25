import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';

export const USUARIO_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/security/users',
  cacheKeyToInvalidate: 'USERS',
  formConfig: [
    {
      title: 'Credenciales e Identidad de Acceso',
      subtitle: 'Defina el correo electrónico, la contraseña inicial y el nivel de rol para la cuenta de usuario.',
      fields: [
        {
          key: 'email',
          type: 'email',
          label: 'Correo Electrónico de Acceso',
          placeholder: 'Ej. colaborador@seyt.gob.mx',
          required: true,
          gridSpan: 1
        },
        {
          key: 'password',
          type: 'password',
          label: 'Contraseña del Usuario',
          placeholder: 'Min. 6 caracteres (Oculta en edición)',
          required: true,
          hideOnEdit: true,
          gridSpan: 1
        },
        {
          key: 'backend_role',
          type: 'enum',
          label: 'Rol del Sistema (Acceso Backend)',
          placeholder: 'Seleccione un rol...',
          options: [
            { label: 'Administrador 🛡️', value: 'admin' },
            { label: 'Superusuario ⚡', value: 'superuser' },
            { label: 'Usuario Estándar 👤', value: 'user' }
          ],
          required: true,
          defaultValue: 'user',
          gridSpan: 1
        },
        {
          key: 'system_role_id',
          type: 'api-select',
          label: 'Rol Funcional (Permisos)',
          placeholder: 'Seleccione un rol de permisos...',
          required: false,
          gridSpan: 1,
          apiConfig: {
            configKey: ENDPOINT_KEYS.ROLES,
            valueKey: 'id',
            labelKey: (item: any) => `${item.name}`
          }
        }
      ]
    },
    {
      title: 'Vínculo Organizacional',
      subtitle: 'Asocie este usuario a un colaborador activo del directorio para enlazar adscripciones y firmas oficiales.',
      fields: [
        {
          key: 'employee_id',
          type: 'api-select',
          label: 'Colaborador Relacionado',
          placeholder: 'Seleccione un colaborador del personal activo (Opcional)...',
          required: false,
          gridSpan: 2,
          apiConfig: {
            configKey: ENDPOINT_KEYS.EMPLOYEES,
            valueKey: 'employee_id',
            labelKey: (item: any) => {
              const name = item.name || '';
              const pat = item.first_surname || '';
              const mat = item.second_surname || '';
              const full = `${name} ${pat} ${mat}`.replace(/\s+/g, ' ').trim();
              const job = item.job_name || '';
              const ar = item.area_name || '';
              const extra = [job, ar].filter(Boolean).join(' - ');
              return extra ? `${full} (${extra})` : full;
            }
          }
        }
      ]
    }
  ]
};
