import { APP_COLORS } from '../maps/app.colors.map';
import { ThemeDefinition } from '../interfaces/app.theme.interface';

export const TemaInstitucional: ThemeDefinition = {
  colors: {
    primary    : APP_COLORS.guinda,
    secondary  : APP_COLORS.dorado,
    background : APP_COLORS.grisNube,
    logo       : APP_COLORS.guinda,
    success    : APP_COLORS.emerald,
    warning    : APP_COLORS.amberGold,
    danger     : APP_COLORS.crimsonRed,
    info       : APP_COLORS.techNavy
  },

  typography: {
    titleSize: '2.25rem',   // text-4xl equivalent
    subtitleSize: '1.5rem', // text-2xl equivalent
    normalSize: '1rem',
    buttonSize: '0.875rem'  // text-sm
  },

  ui: {
    success_bubble: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      text: 'text-emerald-850 dark:text-emerald-400',
      border: 'border-emerald-250 dark:border-emerald-900',
      icon: 'text-emerald-600 dark:text-emerald-400'
    },
    
    warning_bubble: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-800 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400'
    },

    info_bubble: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400'
    }    
  }
};
