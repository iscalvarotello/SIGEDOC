import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { CityDTO } from '@app/core/models/location.dto';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { DBResponse } from '@app/core/api/api.interfaces';


@Injectable({ providedIn: 'root' })
export class CityService extends BaseApiService<CityDTO> {
  constructor() {
    super(ENDPOINT_KEYS.CITIES, CityDTO);
  }

  /**
   * Obtiene todas las ciudades pertenecientes a un estado
   */
  public async getByState(stateId: string, queryParams?: any): Promise<DBResponse<CityDTO[]>> {
    const res = await this.executeSpecialRoute<any>('byState', { stateId }, null, queryParams);
    
    // Mapeamos los datos de respuesta a instancias de CityDTO
    if (res && res.data && Array.isArray(res.data)) {
        res.data = res.data.map((item: any) => new CityDTO(item));
    }
    return res;
  }
}
