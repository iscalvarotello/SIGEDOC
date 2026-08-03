import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiPackageConfig, DBResponse } from './api.interfaces';
import { firstValueFrom } from 'rxjs';
import { CacheManagerService } from '../services/cache-manager.service';
import { GlobalCacheConfig } from '@system-shared/master-detail/master-detail.interfaces';
import { ApiRouteConfig } from './api-routes.config';
import { ApiRouteService } from './api-route.service';
import { applyFrontendMapping } from '../utils/data-mapper.util';

export abstract class BaseApiService<T> {
  protected configPackage: ApiPackageConfig;
  
  // Usamos inject() para que las clases hijas no tengan que inyectar dependencias en su constructor
  protected http = inject(HttpClient); 
  protected cacheManager = inject(CacheManagerService);
  protected apiRouteService = inject(ApiRouteService); 
  
  protected apiRouter: ReturnType<ApiRouteService['forEndpoint']>;

  constructor(
    protected configKey: string,
    protected dtoClass?: new (data: any) => T
  ) {
    this.configPackage = ApiRouteConfig[this.configKey];
    if (!this.configPackage) {
      throw new Error(`ApiRouteConfig no encontrado para la key: ${this.configKey}`);
    }
    this.apiRouter = this.apiRouteService.forEndpoint(this.configKey);
  }

  protected buildUrl(path: string): string {
    return this.apiRouteService.getAbsoluteUrl(path);
  }

  /**
   * Transforma el objeto genérico JSON en instancias de dtoClass si se proporcionó
   */
  protected mapData(data: any): any {
    if (!this.dtoClass || !data) return data;
    if (data instanceof Blob) return data;
    
    const applyMapping = (item: any) => {
      if (this.configPackage.frontendMapping) {
        return applyFrontendMapping(item, this.configPackage.frontendMapping);
      }
      return item;
    };

    if (Array.isArray(data)) {
      return data.map(item => new this.dtoClass!(applyMapping(item)));
    }
    return new this.dtoClass(applyMapping(data));
  }

  // ==========================================
  // MANEJO DE ERRORES CENTRALIZADO
  // ==========================================
  protected async handleRequest<R>(request$: any): Promise<R> {
    try {
      return await firstValueFrom(request$);
    } catch (error: any) {
      // Interceptar errores de servidor (500) y normalizar el mensaje
      if (error?.status === 500 || error?.error?.message === 'Internal server error') {
        const customMessage = 'Problemas a nivel de Servidor. Favor de avisar a la Unidad de Informatica de su dependencia.';
        if (error.error && typeof error.error === 'object') {
           error.error.message = customMessage;
        } else {
           error.message = customMessage;
        }
      }
      
      // El error se pasa a la capa superior (BasePageController, BaseFormController, etc.) 
      // para que manejen la UI según el contexto (Ej. mostrar en tabla, deshabilitar botones, o alerta de guardado).
      throw error;
    }
  }

  // ==========================================
  // METODOS ESTÁNDAR (CRUD)
  // ==========================================

  public async getAll(queryParams?: any, cacheConfig?: GlobalCacheConfig, forceRefresh = false): Promise<DBResponse<T[]>> {
    
    // 1. Intentar Caché si está habilitado y no se fuerza recarga
    if (cacheConfig?.enabled && !forceRefresh) {
      const cached = this.cacheManager.get(cacheConfig.key, queryParams);
      if (cached) {
        return { data: this.mapData(cached) };
      }
    }
    
    // 2. Fetch Network
    const url = this.apiRouter.getAllUrl();
    let params = new HttpParams();
    
    // Usar 'plain=true' si está configurado para este paquete
    if (this.configPackage.plain) {
      params = params.set('plain', 'true');
    }
    
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          params = params.set(key, queryParams[key]);
        }
      });
    }
    
    const response = await this.handleRequest<any>(this.http.get<any>(url, { params }));
    let resultData = response && response.data !== undefined ? response.data : response;
    
    // 3. Guardar Caché
    if (cacheConfig?.enabled) {
      this.cacheManager.set(cacheConfig.key, queryParams, resultData, cacheConfig.ttlMinutes);
    }
    
    if (response && response.data !== undefined) {
       return {
         data: this.mapData(resultData),
         meta: response.meta
       };
    }
    return { data: this.mapData(resultData) };
  }

  public async getById(id: string | number, queryParams?: any): Promise<T> {
    const url = this.apiRouter.getByIdUrl(id);
    let params = new HttpParams();
    
    // Usar 'plain=true' si está configurado para este paquete
    if (this.configPackage.plain) {
      params = params.set('plain', 'true');
    }
    
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
         if (queryParams[key] !== undefined && queryParams[key] !== null) {
          params = params.set(key, queryParams[key]);
         }
      });
    }

    const response = await this.handleRequest<any>(this.http.get<any>(url, { params }));
    
    if (response && response.data !== undefined) {
      return this.mapData(response.data);
    }
    return this.mapData(response);
  }

  public async create(body: any, cacheKeyToInvalidate?: string): Promise<T> {
    const url = this.apiRouter.getAllUrl();
    const response = await this.handleRequest<any>(this.http.post<any>(url, body));
    
    if (cacheKeyToInvalidate) {
      this.cacheManager.invalidateByBaseKey(cacheKeyToInvalidate);
    }
    
    if (response && response.data !== undefined) return this.mapData(response.data);
    return this.mapData(response);
  }

  public async update(id: string | number, body: any, cacheKeyToInvalidate?: string): Promise<T> {
    const url = this.apiRouter.getByIdUrl(id);
    const response = await this.handleRequest<any>(this.http.patch<any>(url, body));
    
    if (cacheKeyToInvalidate) {
      this.cacheManager.invalidateByBaseKey(cacheKeyToInvalidate);
    }
    
    if (response && response.data !== undefined) return this.mapData(response.data);
    return this.mapData(response);
  }

  public async delete(id: string | number, cacheKeyToInvalidate?: string): Promise<any> {
    const url = this.apiRouter.getByIdUrl(id);
    const result = await this.handleRequest<any>(this.http.delete<any>(url));
    
    if (cacheKeyToInvalidate) {
      this.cacheManager.invalidateByBaseKey(cacheKeyToInvalidate);
    }
    
    return result;
  }

  // ==========================================
  // METODOS REACTIVOS (SIGNALS)
  // ==========================================

  public getSignalAll(queryParams?: any): WritableSignal<DBResponse<T[]> | null> {
    const state = signal<DBResponse<T[]> | null>(null);
    this.getAll(queryParams)
      .then(res => state.set(res))
      .catch(err => console.error(`Error fetching all for ${this.configKey}`, err));
    return state;
  }

  // ==========================================
  // RUTAS ESPECIALES
  // ==========================================

  /**
   * Ejecuta una ruta definida en 'specialRoutes'
   */
  public async executeSpecialRoute<R = any>(
    routeName: string, 
    urlParams?: Record<string, any>, 
    body?: any,
    queryParams?: Record<string, any>,
    cacheConfig?: GlobalCacheConfig,
    forceRefresh = false
  ): Promise<R> {
    
    if (!this.configPackage.specialRoutes || !this.configPackage.specialRoutes[routeName]) {
      throw new Error(`La ruta especial '${routeName}' no está definida para '${this.configKey}'`);
    }

    const routeDef = this.configPackage.specialRoutes[routeName];
    const paramsToReplace = urlParams ? { ...urlParams } : {};
    
    // Delegamos la extracción y reemplazo de variables dinámicas al apiRouter
    const url = this.apiRouter.getSpecialRouteUrl(routeName, paramsToReplace);
    
    let httpParams = new HttpParams();
    if (routeDef.method === 'GET' && this.configPackage.plain) {
      httpParams = httpParams.set('plain', 'true');
    }
    
    if (routeDef.plain) {
      httpParams = httpParams.set('plain', 'true');
    }
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          httpParams = httpParams.set(key, queryParams[key]);
        }
      });
    }

    const options: any = { params: httpParams };
    if (routeDef.responseType) {
      options.responseType = routeDef.responseType;
    }

    // Si el body es FormData, el navegador se encargará de establecer el Content-Type adecuado con su respectivo boundary
    if (body instanceof FormData) {
      // Nos aseguramos que no haya Content-Type manual establecido
      options.headers = options.headers || {};
    }

    let request$;
    switch (routeDef.method) {
      case 'GET':    request$ = this.http.get(url, options); break;
      case 'POST':   request$ = this.http.post(url, body, options); break;
      case 'PATCH':  request$ = this.http.patch(url, body, options); break;
      case 'PUT':    request$ = this.http.put(url, body, options); break;
      case 'DELETE': request$ = this.http.delete(url, options); break;
      default: throw new Error(`Método HTTP '${routeDef.method}' no soportado.`);
    }

    // 1. Intentar Caché si está habilitado, no se fuerza recarga y es un método GET
    // Ojo: en specialRoutes, urlParams dictan el contexto, así que los combinamos en la llave
    const cacheKeyContext = urlParams ? { ...urlParams, ...queryParams } : queryParams;
    
    if (routeDef.method === 'GET' && cacheConfig?.enabled && !forceRefresh) {
      const cached = this.cacheManager.get(cacheConfig.key, cacheKeyContext);
      if (cached) {
        return { data: this.mapData(cached) } as unknown as R; // Simular estructura DBResponse
      }
    }

    const response = (await this.handleRequest<any>(request$)) as any;
    let resultData = response && response.data !== undefined ? response.data : response;

    // 3. Guardar Caché
    if (routeDef.method === 'GET' && cacheConfig?.enabled) {
      this.cacheManager.set(cacheConfig.key, cacheKeyContext, resultData, cacheConfig.ttlMinutes);
    }
    
    if (routeDef.method === 'GET') {
       return {
         data: routeDef.raw ? resultData : this.mapData(resultData),
         meta: response?.meta
       } as unknown as R;
    }

    return resultData as R;
  }
}
