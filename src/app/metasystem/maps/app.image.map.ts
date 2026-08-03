import { APP_SETTINGS } from '@metasystem/settings/app.settings';

import { ImageDef } from '../interfaces/app.image.interface';

export const ImageDictionary: Record<string, ImageDef> = {
  'logo'      : { light: APP_SETTINGS.LOGO_PATH_LIGHT, dark: APP_SETTINGS.LOGO_PATH_DARK } ,
  'escudo'    : { light: APP_SETTINGS.LOGO_PATH_LIGHT } ,
  'logo-icon' : { light: APP_SETTINGS.LOGO_PATH_LIGHT } ,
  'grid'      : { light: '/images/shape/grid-01.svg' } ,
  '404'       : { light: '/images/error/404.svg'     , dark: '/images/error/404-dark.svg' }
};