import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';

export const ROLE_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/security/roles',
  cacheKeyToInvalidate: 'ROLES',
  formConfig: [
    {
      title: 'Definición del Rol',
      subtitle: 'Defina un nombre único y su descripción operativa.',
      fields: [
        {
          key: 'name',
          type: 'text',
          label: 'Nombre del Rol',
          placeholder: 'Ej. Recursos Humanos',
          required: true,
          gridSpan: 2
        },
        {
          key: 'description',
          type: 'textarea',
          label: 'Descripción de Responsabilidades',
          placeholder: 'Describa el alcance de este rol...',
          required: true,
          gridSpan: 2
        }
      ]
    }
  ]
};
