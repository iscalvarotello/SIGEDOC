import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalRoutes } from './local-routes.config';

@Injectable({
  providedIn: 'root'
})
export class LocalRouteService {
  private router = inject(Router);

  /**
   * Obtiene la ruta formateada compatible con routerLink [ ]
   */
  getLink(routeKey: string, params?: Record<string, any>): any[] {
    const config = LocalRoutes[routeKey];
    if (!config) {
      console.warn(`[LocalRouteService] Route key '${routeKey}' no encontrada.`);
      return ['/'];
    }

    let path = config.path;
    // Extraer los parámetros dinámicos de la cadena (ej. :id) y reemplazarlos
    if (params) {
      Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, encodeURIComponent(String(params[key])));
      });
    }

    // Dividimos por '/' para que Angular Router lo procese como arreglo, ignorando vacíos
    const segments = path.split('/').filter(s => s.length > 0);
    
    // Agregamos el '/' inicial explícitamente para asegurar que es una ruta absoluta desde la raíz
    return ['/', ...segments];
  }

  /**
   * Navega programáticamente a la ruta.
   */
  go(routeKey: string, params?: Record<string, any>, queryParams?: Record<string, any>) {
    const link = this.getLink(routeKey, params);
    this.router.navigate(link, { queryParams });
  }
}
