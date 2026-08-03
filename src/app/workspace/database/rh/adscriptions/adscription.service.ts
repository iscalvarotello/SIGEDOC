import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { AdscriptionDTO } from './adscription.dto';
import { DBResponse } from '@app/core/api/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdscriptionService extends BaseApiService<AdscriptionDTO> {
  constructor() {
    super(ENDPOINT_KEYS.ADSCRIPTIONS, AdscriptionDTO);
  }

  /**
   * Obtiene la lista de adscripciones vigentes asociadas a un área administrativa específica.
   */
  async getByArea(idArea: string, forceRefresh = false): Promise<DBResponse<AdscriptionDTO[]>> {
    const cacheConfig = {
      enabled: true,
      key: `${ENDPOINT_KEYS.ADSCRIPTIONS}_by_area_${idArea}`,
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

  /**
   * Traspasa a un empleado de una adscripción vigente a una nueva de forma atómica.
   */
  async transfer(id: string, body: any): Promise<AdscriptionDTO> {
    const res = await this.executeSpecialRoute<any>('transfer', { id }, body);
    return this.mapData(res?.data || res);
  }

  /**
   * Da de baja (concluye) una adscripción de personal estableciendo su fecha de término a hoy.
   */
  async dismiss(id: string): Promise<any> {
    return this.executeSpecialRoute<any>('dismiss', { id });
  }

  /**
   * Revoca al encargado temporal de un área y restablece al titular.
   */
  async restoreTitular(areaId: string): Promise<any> {
    return this.executeSpecialRoute<any>('restore_titular', { id: areaId });
  }

  /**
   * Obtiene la lista de recepcionistas activos de un área.
   */
  async getReceptionists(areaId: string): Promise<DBResponse<AdscriptionDTO[]>> {
    const response = await this.executeSpecialRoute<any>(
      'receptionists',
      { area_id: areaId }
    );
    const resultData = response && response.data !== undefined ? response.data : response;
    return {
      data: this.mapData(resultData)
    };
  }
}
