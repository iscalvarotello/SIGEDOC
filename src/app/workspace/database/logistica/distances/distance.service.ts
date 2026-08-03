import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { DistanceDTO } from './distance.dto';

@Injectable({
  providedIn: 'root'
})
export class DistanceService extends BaseApiService<DistanceDTO> {
  constructor() {
    super(ENDPOINT_KEYS.DISTANCES, DistanceDTO);
  }
}
