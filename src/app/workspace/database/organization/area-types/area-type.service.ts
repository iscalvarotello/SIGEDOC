import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { AreaTypeDTO } from './area-type.dto';

@Injectable({
  providedIn: 'root'
})
export class AreaTypeService extends BaseApiService<AreaTypeDTO> {
  constructor() {
    super(ENDPOINT_KEYS.AREA_TYPES, AreaTypeDTO);
  }
}
