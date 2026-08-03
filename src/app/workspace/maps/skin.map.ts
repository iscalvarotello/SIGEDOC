/**
 * Diccionario de Identidad Gráfica del Workspace (Lógica de Negocio)
 * 
 * Este archivo mapea los conceptos propios del sistema (roles, estados de documentos, 
 * bandejas) hacia las clases dinámicas que expone el motor de temas (--theme-primary, etc).
 * 
 * NINGÚN COLOR DURO DEBE EXISTIR AQUÍ. Todo debe resolverse a clases utilitarias
 * que Tailwind leerá de las variables inyectadas por ThemeService.
 */

export const WorkspaceSkin = {
  // ==========================================================
  // Joyas de Color: Roles y Atribuciones (Tailwind Classes)
  // ==========================================================
  roles: {
    titular : {
      bg     : 'bg-theme-primary/10 dark:bg-theme-primary/20',
      text   : 'text-theme-primary dark:text-theme-primary/80',
      border : 'border-theme-primary/20',
      badge  : 'bg-theme-primary text-white'
    },
    encargado: {
      bg     : 'bg-theme-secondary/10 dark:bg-theme-secondary/20',
      text   : 'text-theme-secondary dark:text-theme-secondary/80',
      border : 'border-theme-secondary/20',
      badge  : 'bg-theme-secondary text-white'
    },
    // Roles estáticos que no dependen fuertemente del tema (ej. colores semánticos)
    recepcion: {
      bg      : 'bg-blue-50 dark:bg-blue-900/20',
      text    : 'text-blue-700 dark:text-blue-400',
      border  : 'border-blue-200 dark:border-blue-800',
    },
    revisor: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    autoridad_general: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-250 dark:border-emerald-500/20',
    }
  },

  // ==========================================================
  // Componentes de UI de Negocio Específicos
  // ==========================================================
  businessUI: {
    // Globos de Advertencia o Notas de Negocio (Documentos)
    nota_institucional: {
      bg: 'bg-amber-500/5 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400/90',
      border: 'border-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-400/90'
    },
    // Etiquetas de Bandeja de Documentos
    bandeja_activa: {
      bg: 'bg-theme-primary/5 dark:bg-theme-primary/10',
      text: 'text-theme-primary dark:text-white',
      border: 'border-theme-primary/20',
    }
  }
};
