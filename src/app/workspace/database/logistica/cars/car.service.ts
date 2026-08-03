import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { CarDTO } from './car.dto';

@Injectable({ providedIn: 'root' })
export class CarService extends BaseApiService<CarDTO> {
  constructor() {
    super(ENDPOINT_KEYS.CARS, CarDTO);
  }
}
