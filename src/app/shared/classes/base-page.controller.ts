import { inject, signal, computed, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageControllerConfig } from '../components/master-detail/master-detail.interfaces';
import { CacheManagerService } from '../../core/services/cache-manager.service';
import { SesionService } from '../services/sesion.service';
import { SIDEBAR_MENU } from '../../core/config/menu/sidebar.menu';

@Directive()
export abstract class BasePageController<T> implements OnInit {
  
  protected router = inject(Router);
  protected cacheManager = inject(CacheManagerService);
  public sesionService = inject(SesionService);
  
  // Dependencias dictadas por la clase hija
  protected abstract apiService: any;
  public abstract pageConfig: PageControllerConfig;

  // Estados Reactivos de Permisos de Escritura
  public canUpdate = computed(() => this.checkWritePermission());
  public canDelete = computed(() => this.checkWritePermission());

  // Estados Reactivos Core
  public searchTerm = signal<string>('');
  public selectedItem = signal<T | null>(null);
  
  // Data y estado de carga
  public rawData = signal<any[]>([]);
  public isLoading = signal<boolean>(true);
  public serverError = signal<string | null>(null);
  
  // Parámetros almacenados para las recargas (refresh/sync)
  protected activeQueryParams: any = undefined;
  protected activeUrlParams: any = undefined;

  // Motor Genérico de Filtrado y Ordenamiento
  public filteredItems = computed(() => {
    let result = this.rawData();
    
    if (!result || result.length === 0) return [];
    
    // 1. Filtrado de Búsqueda
    const term = this.searchTerm().toLowerCase();
    if (term && this.pageConfig.searchFields?.length) {
      result = result.filter((item: any) => {
        return this.pageConfig.searchFields!.some(field => {
          const val = item[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      });
    }

    // 2. Motor de Ordenamiento Genérico
    if (this.pageConfig.sortConfig) {
      const { key, direction } = this.pageConfig.sortConfig;
      // Clonamos para no mutar memoria
      result = [...result].sort((a: any, b: any) => {
        const valA = a[key];
        const valB = b[key];
        
        // Nulos siempre al fondo
        if (valA == null && valB == null) return 0;
        if (valA == null) return direction === 'asc' ? 1 : -1;
        if (valB == null) return direction === 'asc' ? -1 : 1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  ngOnInit(): void {
    if (!this.pageConfig) {
      throw new Error(`La clase hija debe definir 'pageConfig' antes de inicializar.`);
    }
    if (this.pageConfig.deferLoading) {
      this.isLoading.set(false); // No cargar nada todavía, esperar a que el filtro lo detone
    } else {
      this.loadData();
    }
  }

  // --- ACCIONES MAESTRAS ---

  async loadData(forceRefresh = false, urlParams?: any, queryParams?: any) {
    this.isLoading.set(true);
    
    // Guardar los parámetros para futuras recargas (ej. cuando se presione el botón Refresh)
    if (urlParams !== undefined) this.activeUrlParams = urlParams;
    if (queryParams !== undefined) this.activeQueryParams = queryParams;

    try {
      this.serverError.set(null);
      let response: any;
      if (this.pageConfig.fetchRoute) {
         response = await this.apiService.executeSpecialRoute(
           this.pageConfig.fetchRoute, 
           this.activeUrlParams, 
           undefined, 
           this.activeQueryParams, 
           this.pageConfig.cacheConfig, 
           forceRefresh
         );
      } else {
         response = await this.apiService.getAll(this.activeQueryParams, this.pageConfig.cacheConfig, forceRefresh);
      }
      this.rawData.set(response.data || response || []);
    } catch (error: any) {
      console.error('Error cargando la lista:', error);
      if (error?.status === 500 || error?.error?.message === 'Internal server error') {
        this.serverError.set('Problemas a nivel de Servidor. Favor de avisar a la Unidad de Informatica de su dependencia.');
      } else {
        this.serverError.set(error?.error?.message || error?.message || 'Ocurrió un error al cargar los datos.');
      }
      this.rawData.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  async refresh() {
    // Fuerza la recarga ignorando el caché actual para traer los más nuevos, 
    // y al terminar sobreescribe el caché con la nueva data.
    await this.loadData(true, this.activeUrlParams, this.activeQueryParams);
  }

  async sync() {
    // Destruye completamente el caché de este módulo y recarga de cero
    if (this.pageConfig.cacheConfig?.enabled && this.pageConfig.cacheConfig.key) {
      this.cacheManager.invalidateByBaseKey(this.pageConfig.cacheConfig.key);
    }
    await this.loadData(true, this.activeUrlParams, this.activeQueryParams);
  }

  filtrar(term: string) {
    this.searchTerm.set(term);
  }

  select(item: any) {
    this.selectedItem.set(item);
  }

  nuevo() {
    this.router.navigate([this.pageConfig.mainRoute, 'new'], { queryParams: this.activeUrlParams });
  }

  edit(item: any) {
    this.router.navigate([this.pageConfig.mainRoute, item.id]);
  }

  async delete(item: any) {
    const displayName = item.name || item.fullName || item.id;
    if (confirm(`⚠️ PROTECCIÓN: ¿Estás seguro de eliminar ${displayName}? Esta acción no se puede deshacer.`)) {
      try {
        await this.apiService.delete(item.id, this.pageConfig.cacheConfig?.key);
        
        // Refrescamos tabla llamando a loadData (forzando refresh de red)
        await this.loadData(true);
        
        // Si estaba seleccionado, lo limpiamos
        if ((this.selectedItem() as any)?.id === item.id) {
          this.selectedItem.set(null);
        }
      } catch (error: any) {
        console.error('Error al intentar eliminar el registro:', error);
        const msg = error?.error?.message || error?.message || 'Revisa la consola para más detalles';
        alert('Hubo un problema al intentar eliminar:\n' + msg);
      }
    }
  }

  /**
   * Evalúa si el usuario activo tiene permiso de escritura (update/delete)
   * para el módulo actual en base a su ruta principal.
   */
  private checkWritePermission(): boolean {
    if (!this.sesionService.isLoggedIn()) return true; // Fallback para desarrollo sin login

    let matchedModuleId: number | null = null;
    const routeToMatch = this.pageConfig.mainRoute;

    if (routeToMatch) {
      for (const section of SIDEBAR_MENU) {
        for (const item of section.items) {
          if (item.subItems) {
            const found = item.subItems.find(sub => sub.path === routeToMatch);
            if (found) {
              matchedModuleId = found.module_id;
              break;
            }
          }
        }
        if (matchedModuleId !== null) break;
      }
    }

    if (matchedModuleId === null) return true; // Si no está mapeado, permitir

    const perms = this.sesionService.permissions();
    if (perms.length === 0) return true; // Fallback de gracia si aún no cargan permisos

    const p = perms.find(x => x.module_id === matchedModuleId);
    return p ? p.can_update : false;
  }
}
