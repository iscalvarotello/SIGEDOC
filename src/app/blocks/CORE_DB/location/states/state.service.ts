import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { StateDTO } from './state.dto';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';

@Injectable({
  providedIn: 'root'
})
export class StateService extends BaseApiService<StateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.STATES, StateDTO);
  }

  /**
   * Obtiene todos los estados pertenecientes a un país
   */
  async getByCountry(countryId: string) {
    return this.executeSpecialRoute('byCountry', { countryId });
  }
}
