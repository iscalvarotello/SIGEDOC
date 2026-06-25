import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {
  private http = inject(HttpClient);
  
  private get baseUrl() {
    return environment.URL_PATH.replace(/\/$/, '');
  }

  /**
   * Obtiene la configuración activa de márgenes y leyendas de la firma electrónica.
   */
  async getSignatureSettings(): Promise<any> {
    const url = `${this.baseUrl}/signatures/settings`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Actualiza los valores de márgenes y leyendas de la firma electrónica.
   */
  async updateSignatureSettings(payload: { offset_y: number; margin_x: number; legend_footnote?: string; legend_acuse?: string; }): Promise<any> {
    const url = `${this.baseUrl}/signatures/settings`;
    return firstValueFrom(this.http.patch<any>(url, payload));
  }

  /**
   * Sube una nueva imagen de membrete (.jpg) al servidor.
   */
  async uploadBackground(file: File): Promise<any> {
    const url = `${this.baseUrl}/system/background`;
    const formData = new FormData();
    formData.append('file', file);
    return firstValueFrom(this.http.post<any>(url, formData));
  }

  /**
   * Retorna la URL del endpoint que sirve el membrete actual.
   * Añadimos un query param timestamp opcional para invalidar caché en el navegador.
   */
  getBackgroundUrl(timestamp?: number): string {
    const base = `${this.baseUrl}/system/background`;
    return timestamp ? `${base}?t=${timestamp}` : base;
  }

  /**
   * Ejecuta una semilla (seed) en el backend.
   */
  async runSeed(seedType: 'system' | 'location' | 'organization' | 'logistic' | 'rh' | 'documents'): Promise<any> {
    let endpoint = '';
    switch (seedType) {
      case 'system': endpoint = '/seed/system'; break;
      case 'location': endpoint = '/seed/location'; break;
      case 'organization': endpoint = '/seed_organization/seed'; break;
      case 'logistic': endpoint = '/logistic/seed'; break;
      case 'rh': endpoint = '/seed-rh/seed'; break;
      case 'documents': endpoint = '/seed-documents'; break;
    }
    const url = `${this.baseUrl}${endpoint}`;
    return firstValueFrom(this.http.get<any>(url));
  }

  /**
   * Obtiene todos los registros de minutarios globales.
   */
  async getGlobalMinutarios(): Promise<any[]> {
    const url = `${this.baseUrl}/system/global-minutarios`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Obtiene todos los minutarios de las áreas del año especificado.
   */
  async getAreasMinutarios(year: number): Promise<any[]> {
    const url = `${this.baseUrl}/system/areas-minutarios?year=${year}`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Ejecuta la inicialización de un nuevo año fiscal.
   */
  async prepareNewYear(year: number): Promise<any> {
    const url = `${this.baseUrl}/system/new-year/${year}`;
    return firstValueFrom(this.http.post<any>(url, {}));
  }

  /**
   * Obtiene la configuración global del sistema (SMTP, Límites, Token, Bloqueo).
   */
  async getGlobalSettings(): Promise<any> {
    const url = `${this.baseUrl}/system/global-settings`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Actualiza la configuración global del sistema.
   */
  async updateGlobalSettings(payload: any): Promise<any> {
    const url = `${this.baseUrl}/system/global-settings`;
    const res = await firstValueFrom(this.http.patch<any>(url, payload));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Ejecuta la limpieza de archivos temporales huérfanos.
   */
  async cleanTempFiles(): Promise<any> {
    const url = `${this.baseUrl}/system/clean-temp-files`;
    const res = await firstValueFrom(this.http.post<any>(url, {}));
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Ajusta o reinicia el contador de minutario para una o todas las áreas.
   */
  async adjustMinutario(payload: { year: number; type: string; newValue: number; scope: 'all' | 'specific'; areaId?: string }): Promise<any> {
    const url = `${this.baseUrl}/system/minutarios/adjust`;
    const res = await firstValueFrom(this.http.patch<any>(url, payload));
    return res && res.data !== undefined ? res.data : res;
  }
}


