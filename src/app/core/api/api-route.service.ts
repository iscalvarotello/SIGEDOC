import { Injectable } from '@angular/core';
import { ApiRouteConfig } from './api-routes.config';
import { environment } from '../../../environments/environment';
import { compareStrings } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiRouteService {

  /**
   * Obtiene la URL base de un endpoint configurado.
   * @param endpointKey La llave principal del diccionario
   * @returns Ruta base (ej. 'organization/institutions') sin slash inicial
   */
  getBaseRoute(endpointKey: string): string {
    const realKey = Object.keys(ApiRouteConfig).find(k => compareStrings(k, endpointKey));
    const config = realKey ? ApiRouteConfig[realKey] : undefined;
    if (!config) throw new Error(`Endpoint key '${endpointKey}' no encontrado en ApiRouteConfig.`);
    
    return config.base.startsWith('/') ? config.base.substring(1) : config.base;
  }

  /**
   * Extrae una ruta especial del diccionario centralizado ApiRouteConfig
   * y reemplaza los parámetros dinámicos de forma automática.
   * 
   * @param endpointKey La llave principal del diccionario (ej. ENDPOINT_KEYS.INSTITUTIONS)
   * @param routeKey El nombre de la ruta especial (ej. 'getLogo')
   * @param paramsObj Objeto opcional con valores para reemplazar (ej. { id: '123' })
   * @returns Ruta procesada sin slash inicial (ej. 'organization/institutions/123/assets/logo')
   */
  getSpecialRoute(endpointKey: string, routeKey: string, paramsObj?: Record<string, any>): string {
    const realKey = Object.keys(ApiRouteConfig).find(k => compareStrings(k, endpointKey));
    const config = realKey ? ApiRouteConfig[realKey] : undefined;
    if (!config) {
      throw new Error(`Endpoint key '${endpointKey}' no encontrado en ApiRouteConfig.`);
    }

    const specialRoute = config.specialRoutes?.[routeKey];
    if (!specialRoute) {
      throw new Error(`Ruta especial '${routeKey}' no encontrada en el endpoint '${endpointKey}'.`);
    }

    let finalPath = specialRoute.path;

    if (paramsObj) {
      Object.keys(paramsObj).forEach(key => {
        if (finalPath.includes(`:${key}`)) {
          finalPath = finalPath.replace(`:${key}`, encodeURIComponent(paramsObj[key]));
        }
      });
    }

    // Se recomienda retornar sin slash inicial para consistencia en bindings HTML como server_img
    return finalPath.startsWith('/') ? finalPath.substring(1) : finalPath;
  }

  /**
   * Construye la URL absoluta (incluyendo la URL base de la API del environment).
   * @param relativePath Ruta relativa sin slash inicial
   */
  getAbsoluteUrl(relativePath: string): string {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${baseUrl}${cleanPath}`;
  }

  /**
   * Genera un "Router" instanciado para un Endpoint específico,
   * permitiendo llamadas limpias sin repetir el endpointKey.
   */
  forEndpoint(endpointKey: string) {
    return {
      getBaseRoute: () => this.getBaseRoute(endpointKey),
      
      // URLs Absolutas listas para HttpClient
      getAllUrl: () => this.getAbsoluteUrl(this.getBaseRoute(endpointKey)),
      getByIdUrl: (id: string | number) => this.getAbsoluteUrl(`${this.getBaseRoute(endpointKey)}/${id}`),
      getSpecialRouteUrl: (routeKey: string, paramsObj?: Record<string, any>) => 
        this.getAbsoluteUrl(this.getSpecialRoute(endpointKey, routeKey, paramsObj)),
        
      // URL Relativa si se necesita para UI
      getSpecialRouteRelative: (routeKey: string, paramsObj?: Record<string, any>) => 
        this.getSpecialRoute(endpointKey, routeKey, paramsObj)
    };
  }
}
