import { environment } from '../../../environments/environment';

/**
 * Construye la URL completa usando environment.URL_PATH y reemplaza parámetros dinámicos (ej. :id)
 */
export function buildApiUrl(path: string, paramsObj?: Record<string, any>): string {
  let finalPath = path;
  
  if (paramsObj) {
    Object.keys(paramsObj).forEach(key => {
      if (finalPath.includes(`:${key}`)) {
        finalPath = finalPath.replace(`:${key}`, encodeURIComponent(paramsObj[key]));
        delete paramsObj[key];
      }
    });
  }
  
  // Normalizar slashes
  const baseUrl = environment.URL_PATH.replace(/\/$/, '');
  const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
  
  return `${baseUrl}${cleanPath}`;
}
