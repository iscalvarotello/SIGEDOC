import { APP_COLORS } from '../maps/app.colors.map';
import { ThemeDefinition } from '../interfaces/app.theme.interface';

export const TemaInvierno: ThemeDefinition = {
  colors: {
    primary: APP_COLORS.charcoalDark,
    secondary: APP_COLORS.grisPlomo,
    background: APP_COLORS.grisNube,
    logo: APP_COLORS.charcoalDark,
    success: APP_COLORS.emerald,
    warning: APP_COLORS.amberGold,
    danger: APP_COLORS.crimsonRed,
    info: APP_COLORS.royalBlue
  },
  typography: {
    // Invierno: tipografía compacta y formal
    titleSize: '2rem',
    subtitleSize: '1.5rem',
    normalSize: '1rem',
    buttonSize: '0.95rem'
  },
  ui: {
    success_bubble: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      text: 'text-emerald-900 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      icon: 'text-emerald-600 dark:text-emerald-400'
    },
    warning_bubble: {
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      text: 'text-amber-900 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
      icon: 'text-amber-600 dark:text-amber-400'
    },
    info_bubble: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-900 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  }
};
