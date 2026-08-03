import { ActionBarAction } from '@system-shared/common/action-bar/action-bar.component';

/**
 * Retorna la configuración de acciones para el panel de adscripciones.
 * Permite deshabilitar dinámicamente las acciones basadas en la presencia de titulares y encargados.
 * 
 * @param canChangeTitular Indica si se puede cambiar el titular (si existe uno activo).
 * @param canRestoreTitular Indica si se puede restablecer el titular (si hay un encargado temporal).
 */
export function getAdscriptionsActionsConfig(canChangeTitular: boolean, canRestoreTitular: boolean): ActionBarAction[] {
  return [
    {
      id: 'adscribir',
      name: 'Adscribir',
      subtitle: 'Operativo',
      iconName: 'Adscribir',
      colorClass: 'hover:border-theme-primary',
      iconColorClass: 'bg-theme-primary/10 text-theme-primary'
    },
    {
      id: 'transferir',
      name: 'Cambio Adsc.',
      subtitle: 'Traspaso',
      iconName: 'Transferir',
      colorClass: 'hover:border-blue-600',
      iconColorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'asignar_titular',
      name: 'Asignar Titular',
      subtitle: 'Jefe',
      iconName: 'Titular',
      colorClass: 'hover:border-theme-primary',
      iconColorClass: 'bg-theme-primary/10 text-theme-primary'
    },
    {
      id: 'cambiar_titular',
      name: 'Cambio Titular',
      subtitle: 'Traspasar Jefe',
      iconName: 'CambioTitular',
      colorClass: 'hover:border-theme-secondary',
      iconColorClass: 'bg-theme-secondary/10 text-theme-secondary',
      disabled: !canChangeTitular
    },
    {
      id: 'encargar',
      name: 'Encargar Área',
      subtitle: 'Temporal',
      iconName: 'Escudo',
      colorClass: 'hover:border-theme-secondary',
      iconColorClass: 'bg-theme-secondary/10 text-theme-secondary'
    },
    {
      id: 'restablecer',
      name: 'Restablecer',
      subtitle: 'Quitar Enc.',
      iconName: 'Restablecer',
      colorClass: 'hover:border-red-500',
      iconColorClass: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      disabled: !canRestoreTitular
    }
  ];
}
