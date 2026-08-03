import { APP_COLORS } from '../maps/app.colors.map';
import { ThemeDefinition } from '../interfaces/app.theme.interface';

export const TemaOtono: ThemeDefinition = {
  colors: {
    primary: APP_COLORS.ocreTierra,
    secondary: APP_COLORS.mostaza,
    background: APP_COLORS.warmPeach,
    logo: APP_COLORS.canelaOscuro,
    success: APP_COLORS.emerald,
    warning: APP_COLORS.amberGold,
    danger: APP_COLORS.burntOrange,
    info: APP_COLORS.techNavy
  },
  typography: {
    // Otoño: tipografía más sobria, ligeramente reducida
    titleSize: '2.25rem',
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
      bg: 'bg-slate-100 dark:bg-slate-900/40',
      text: 'text-slate-900 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      icon: 'text-slate-600 dark:text-slate-400'
    }
  }
};
