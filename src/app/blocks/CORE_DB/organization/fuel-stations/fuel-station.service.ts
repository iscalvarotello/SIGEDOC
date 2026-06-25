import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';
import { FuelStationDTO } from './fuel-station.dto';

@Injectable({
  providedIn: 'root'
})
export class FuelStationService extends BaseApiService<FuelStationDTO> {
  constructor() {
    super(ENDPOINT_KEYS.FUEL_STATIONS, FuelStationDTO);
  }
}
