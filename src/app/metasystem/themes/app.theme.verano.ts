import { APP_COLORS } from '../maps/app.colors.map';
import { ThemeDefinition } from '../interfaces/app.theme.interface';

export const TemaVerano: ThemeDefinition = {
  colors: {
    primary: APP_COLORS.forestDeep,
    secondary: APP_COLORS.sageGreen,
    background: APP_COLORS.mintSoft,
    logo: APP_COLORS.forestDeep,
    success: APP_COLORS.emerald,
    warning: APP_COLORS.amberGold,
    danger: APP_COLORS.crimsonRed,
    info: APP_COLORS.cyanAccent
  },
  typography: {
    // Verano: tipografía fresca y ligeramente más grande
    titleSize: '2.5rem',
    subtitleSize: '1.75rem',
    normalSize: '1.125rem',
    buttonSize: '1rem'
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
      bg: 'bg-cyan-100 dark:bg-cyan-900/40',
      text: 'text-cyan-900 dark:text-cyan-300',
      border: 'border-cyan-300 dark:border-cyan-700',
      icon: 'text-cyan-600 dark:text-cyan-400'
    }
  }
};
