import { ActionBarAction } from '../../../../shared/components/common/action-bar/action-bar.component';
import { UserDTO } from './user.dto';

/**
 * Retorna la configuración de acciones administrativas para el panel de usuarios.
 * 
 * @param user El usuario actualmente seleccionado sobre el cual operar.
 */
export function getActionsConfig(user: UserDTO | null): ActionBarAction[] {
  if (!user) return [];

  const isActive = user.active;
  const isSuper = user.backend_role === 'superadmin';

  return [
    {
      id: 'toggle_active',
      name: isActive ? 'Desactivar Usuario' : 'Activar Usuario',
      subtitle: isActive ? 'Baja Temporal' : 'Alta de Cuenta',
      iconName: 'power_off',
      colorClass: isActive ? 'hover:border-red-500' : 'hover:border-emerald-500',
      iconColorClass: isActive
        ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
    },
    {
      id: 'reset_password',
      name: 'Restablecer Contraseña',
      subtitle: 'Contraseña Default',
      iconName: 'Refresh',
      colorClass: 'hover:border-amber-500',
      iconColorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
    },
    {
      id: 'make_superadmin',
      name: 'Hacer Super Admin',
      subtitle: 'Privilegios de Dios',
      iconName: 'crow',
      colorClass: 'hover:border-blue-600',
      iconColorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      disabled: isSuper
    }
  ];
}

