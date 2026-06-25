import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { CityDTO } from './city.dto';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseApiService<CityDTO> {
  constructor() {
    super(ENDPOINT_KEYS.CITIES, CityDTO);
  }
}
