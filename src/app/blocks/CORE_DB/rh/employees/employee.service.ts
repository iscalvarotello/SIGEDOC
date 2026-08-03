import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { EmployeeDTO } from './employee.dto';
import { DBResponse } from '@app/core/api/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseApiService<EmployeeDTO> {
  constructor() {
    super(ENDPOINT_KEYS.EMPLOYEES, EmployeeDTO);
  }

  /**
   * Obtiene la lista de empleados activos y adscritos en un área administrativa específica.
   */
  async getByArea(idArea: string, forceRefresh = false): Promise<DBResponse<EmployeeDTO[]>> {
    const cacheConfig = {
      enabled: true,
      key: `${ENDPOINT_KEYS.EMPLOYEES}_by_area_${idArea}`,
      ttlMinutes: 5
    };

    const response = await this.executeSpecialRoute<any>(
      'byArea',
      { idArea },
      undefined,
      { active: 'true' },
      cacheConfig,
      forceRefresh
    );

    const resultData = response && response.data !== undefined ? response.data : response;
    return {
      data: this.mapData(resultData)
    };
  }

  async dismiss(id: string): Promise<any> {
    return this.executeSpecialRoute<any>('dismiss', { id });
  }

  async getDeadlist(forceRefresh = false): Promise<DBResponse<EmployeeDTO[]>> {
    const response = await this.executeSpecialRoute<any>('deadlist', {}, undefined, {}, undefined, forceRefresh);
    const resultData = response && response.data !== undefined ? response.data : response;
    return {
      data: this.mapData(resultData)
    };
  }

  /**
   * Sube el archivo de firma electrónica (.p12) para el empleado
   */
  async uploadFirma(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.executeSpecialRoute<any>('subirFirma', { id }, formData);
  }

  /**
   * Asigna o remueve el empleado que da el Visto Bueno (VoBo) a otro empleado
   */
  async assignVobo(id: string, voboId: string | null): Promise<any> {
    return this.executeSpecialRoute<any>('asignarVobo', { id }, { vobo_id: voboId });
  }
}
