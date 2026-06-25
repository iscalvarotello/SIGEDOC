import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiRouteConfig } from '../api/api-routes.config';
import { CacheConfig } from '../../shared/interfaces/dynamic-form.interface';
import { CacheManagerService } from './cache-manager.service';

interface CacheEntry {
  data: any[];
  expiresAt: number | null; // Timestamp en milisegundos. null = infinito.
}

@Injectable({
  providedIn: 'root'
})
export class GenericApiService {
  
  private http = inject(HttpClient);
  private cacheManager = inject(CacheManagerService);

  /**
   * Obtiene datos para un dropdown usando configuración dinámica y manejando caché.
   */
  async getDropdownOptions(
    configKey: string, 
    queryParams?: Record<string, any>, 
    cacheConfig?: CacheConfig
  ): Promise<any[]> {
    
    // 1. Verificar caché si está habilitado
    if (cacheConfig && cacheConfig.enabled) {
      // Usamos el configKey como baseKey
      const cached = this.cacheManager.get(configKey, queryParams);
      if (cached) {
        return cached;
      }
    }

    // 3. Obtener configuración de ruta
    const configPackage = (ApiRouteConfig as any)[configKey];
    if (!configPackage) {
      throw new Error(`ApiRouteConfig no encontrado para la llave: ${configKey}`);
    }

    // 4. Preparar la URL y los Parámetros
    const url = this.buildUrl(configPackage.base);
    let params = new HttpParams();
    
    // Inyectar 'plain=true' si el paquete lo requiere
    if (configPackage.plain) {
      params = params.set('plain', 'true');
    }

    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
          params = params.set(key, queryParams[key]);
        }
      });
    }

    // 5. Petición HTTP
    const response = await firstValueFrom(this.http.get<any>(url, { params }));
    const data = response && response.data !== undefined ? response.data : response;

    // 6. Guardar en Caché si está habilitado
    if (cacheConfig && cacheConfig.enabled) {
      this.cacheManager.set(configKey, queryParams, data, cacheConfig.ttlMinutes);
    }

    return data || [];
  }

  /**
   * Limpia el caché completo o una llave específica.
   */
  clearCache(configKey?: string) {
    if (configKey) {
      this.cacheManager.invalidateByBaseKey(configKey);
    } else {
      this.cacheManager.clearAll();
    }
  }

  private buildUrl(path: string): string {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
}
