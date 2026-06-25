import { ActionBarAction } from '../../../../shared/components/common/action-bar/action-bar.component';

/**
 * Retorna la configuración de acciones para el panel de empleados.
 * Permite deshabilitar dinámicamente las acciones que requieren un colaborador seleccionado.
 * 
 * @param canOperate Indica si hay un colaborador seleccionado para operar.
 */
export function getEmployeeActionsConfig(canOperate: boolean): ActionBarAction[] {
  return [
    {
      id: 'nuevo',
      name: 'Asignar Empleado',
      subtitle: 'Alta',
      iconName: 'Adscribir',
      colorClass: 'hover:border-[#691C32]',
      iconColorClass: 'bg-[#691C32]/10 text-[#691C32]'
    },
    {
      id: 'reactivar',
      name: 'Reactivar Empleado',
      subtitle: 'Lista Negra',
      iconName: 'Restablecer',
      colorClass: 'hover:border-emerald-500',
      iconColorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
    },
    {
      id: 'traspaso',
      name: 'Cambio de Adsc.',
      subtitle: 'Traspaso',
      iconName: 'Transferir',
      colorClass: 'hover:border-blue-600',
      iconColorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      disabled: !canOperate
    },
    {
      id: 'nueva_adscripcion',
      name: 'Agregar Adsc.',
      subtitle: 'Multi-adscripción',
      iconName: 'Titular',
      colorClass: 'hover:border-amber-500',
      iconColorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
      disabled: !canOperate
    },
    {
      id: 'baja',
      name: 'Baja del Empleado',
      subtitle: 'Baja Total',
      iconName: 'Basurero',
      colorClass: 'hover:border-red-500',
      iconColorClass: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      disabled: !canOperate
    }
  ];
}
