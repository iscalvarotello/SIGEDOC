import { ThemeDefinition } from '../interfaces/app.theme.interface';
import { AppProfile } from '../interfaces/app.profile.interface';
import { TemaInstitucional } from '../themes/app.theme.institucional';
import { TemaVerano } from '../themes/app.theme.verano';
import { TemaPrimavera } from '../themes/app.theme.primavera';
import { TemaOtono } from '../themes/app.theme.otoño';
import { TemaInvierno } from '../themes/app.theme.invierno';

const SYSTEMS: Record<string, AppProfile> = {
  sigedoc: {
    SYSTEM_NAME: 'SIGEDOC',
    SYSTEM_SHORT_NAME: 'SIGEDOC',
    SYSTEM_SLOGAN: 'Sistema Integral de Gestión Documental',
    SYSTEM_PURPOSE: 'Plataforma digital integrada de la Secretaría de Economía y del Trabajo para el control, firma electrónica y despacho de documentación oficial del Estado de Chiapas.',
    LOGO_PATH_LIGHT: '/images/logo/logo-icon.svg',
    LOGO_PATH_DARK: '/images/logo/logo-icon.svg',
    FAVICON_PATH: '/favicon.ico', 
    LOGO_WIDTH: '48',
    LOGO_HEIGHT: '48',
    LOGO_EXPAND_SIZE: '48',
    LOGO_COLLAPSE_SIZE: '72',
    LOGO_INLINE_GAP: 'gap-3',
    LOGO_INLINE_MARGIN: ''
  },
  husky: {
    SYSTEM_NAME: 'Husky',
    SYSTEM_SHORT_NAME: 'Husky',
    SYSTEM_SLOGAN: 'Plataforma Integral de Gestión Documental',
    SYSTEM_PURPOSE: 'Plataforma Digital Integrada de control, firma electrónica y despacho de documentos oficiales',
    LOGO_PATH_LIGHT: '/images/logo/husky.svg',
    LOGO_PATH_DARK: '/images/logo/husky.svg',
    FAVICON_PATH: '/images/logo/husky.svg', 
    LOGO_WIDTH: '100', 
    LOGO_HEIGHT: '100',
    LOGO_EXPAND_SIZE: '96',
    LOGO_COLLAPSE_SIZE: '84',
    LOGO_INLINE_GAP: 'gap-1.5',
    LOGO_INLINE_MARGIN: '-ml-3 -mr-2'
  }
};

export const THEMES: Record<string, ThemeDefinition> = {
  institucional: TemaInstitucional,
  primavera: TemaPrimavera,
  otono: TemaOtono,
  invierno: TemaInvierno, 
  verano: TemaVerano,
};

// ==========================================
// CONFIGURACIÓN ACTIVA
// ==========================================
const ACTIVE_SYSTEM = 'husky'; 
const ACTIVE_THEME = 'institucional'; 
// ==========================================

export const APP_SETTINGS = {
  ...SYSTEMS[ACTIVE_SYSTEM],
  THEME: THEMES[ACTIVE_THEME],
  
  // Storage Keys
  STORAGE_TOKEN: 'system_token',
  STORAGE_USER_DATA: 'system_user_data',
  STORAGE_ACTIVE_ADSCRIPTION: 'system_active_adscription',
  STORAGE_DASHBOARD_CONFIG: 'system_dashboard_config',
  STORAGE_TENANT_ID: 'system_tenant_id',

  // Configuración de Título Dinámico
  get PAGE_TITLE_FORMAT(): string {
    return `${this.SYSTEM_NAME} | ${this.SYSTEM_SLOGAN}`;
  }
};
