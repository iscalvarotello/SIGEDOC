import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { TariffMatrixDTO } from './tariff.dto';

@Injectable({
  providedIn: 'root'
})
export class TariffService extends BaseApiService<TariffMatrixDTO> {
  constructor() {
    super(ENDPOINT_KEYS.TARIFFS, TariffMatrixDTO);
  }

  public async getMatrix(year: number) {
    return this.executeSpecialRoute('getMatrix', { year });
  }
}
