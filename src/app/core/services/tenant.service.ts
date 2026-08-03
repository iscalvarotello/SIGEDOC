import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { ApiRouteService } from '../api/api-route.service';
import { ENDPOINT_KEYS } from '../api/api-routes.config';

export interface TenantInfo {
  id: string;
  name: string;
  acronym: string;
  logo?: string;
  shield?: string;
  background?: string;
  footer?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiRouter = inject(ApiRouteService).forEndpoint(ENDPOINT_KEYS.INSTITUTIONS);
  
  // Imagen de fondo estática o configurable para el sistema
  public systemImage = signal<string>('/images/system/system-image.jpg');
  
  // Lista completa para el selector del Login
  public institutions = signal<TenantInfo[]>([]);
  
  // Tenant actualmente seleccionado en el sistema
  public currentTenant = signal<TenantInfo | null>(null);

  constructor() {
    this.loadSavedTenantLocally();
  }

  private loadSavedTenantLocally() {
    const savedId = localStorage.getItem('tenant_id');
    if (savedId) {
      // Cargamos un objeto base para que el frontend no rompa mientras fetch
      this.currentTenant.set({ id: savedId, name: 'Cargando...', acronym: '' });
    }
  }

  async loadInstitutionsForLogin() {
    try {
      const baseUrl = environment.URL_PATH.replace(/\/$/, '');
      const res: any = await lastValueFrom(this.http.get(`${baseUrl}/organization/institutions`));
      
      const list = res.data || res || [];
      this.institutions.set(list);
      
      // Intentar restaurar el tenant con la info completa
      const savedId = localStorage.getItem('tenant_id');
      if (savedId && list.length > 0) {
        const found = list.find((i: any) => i.id === savedId);
        if (found) {
          this.setTenant(found);
        } else {
          this.setTenant(list[0]);
        }
      } else if (list.length > 0) {
        // Seleccionar el primero por defecto
        this.setTenant(list[0]);
      }
    } catch (error) {
      console.error('Error cargando instituciones para el login. Asegúrate de que el endpoint no exija JWT o expón uno público.', error);
    }
  }

  setTenant(tenant: TenantInfo) {
    const timestamp = new Date().getTime();
    
    // Evaluamos si el backend reporta que existen las imágenes (ya sea con sus campos originales o casteados)
    const hasLogo = !!tenant.logo;
    const hasShield = !!(tenant.shield || (tenant as any).escudo);
    const hasBackground = !!(tenant.background || (tenant as any).back);

    const formattedTenant: TenantInfo = {
      ...tenant,
      logo: hasLogo ? `${this.apiRouter.getSpecialRouteUrl('getLogo', { id: tenant.id })}?t=${timestamp}` : undefined,
      shield: hasShield ? `${this.apiRouter.getSpecialRouteUrl('getEscudo', { id: tenant.id })}?t=${timestamp}` : undefined,
      background: hasBackground ? `${this.apiRouter.getSpecialRouteUrl('getBack', { id: tenant.id })}?t=${timestamp}` : undefined
    };

    this.currentTenant.set(formattedTenant);
    if (tenant && tenant.id) {
      localStorage.setItem('tenant_id', tenant.id);
    } else {
      localStorage.removeItem('tenant_id');
    }
  }

  updateTenantData(partialData: Partial<TenantInfo>) {
    const current = this.currentTenant();
    if (current && current.id === partialData.id) {
      this.currentTenant.set({ ...current, ...partialData });
    }
  }
}
