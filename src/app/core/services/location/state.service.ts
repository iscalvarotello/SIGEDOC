import { Injectable     } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { StateDTO       } from '@app/core/models/location.dto';
import { ENDPOINT_KEYS  } from '@app/core/api/api-routes.config';
import { DBResponse     } from '@app/core/api/api.interfaces';

@Injectable({ providedIn: 'root' })
export class StateService extends BaseApiService<StateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.STATES, StateDTO);
  }

  /**
   * Obtiene todos los estados pertenecientes a un país
   */
  public async getByCountry(countryId: string, queryParams?: any): Promise<DBResponse<StateDTO[]>> {
    const res = await this.executeSpecialRoute<any>('byCountry', { countryId }, null, queryParams);
    
    // Mapeamos los datos de respuesta a instancias de StateDTO
    if (res && res.data && Array.isArray(res.data)) {
        res.data = res.data.map((item: any) => new StateDTO(item));
    }
    return res;
  }
}
