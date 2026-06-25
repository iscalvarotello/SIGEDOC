import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';
import { TollBooth, TollBoothDTO } from './toll-booth.dto';

@Injectable({
  providedIn: 'root'
})
export class TollBoothService extends BaseApiService<TollBoothDTO> {
  constructor() {
    super(ENDPOINT_KEYS.TOLL_BOOTHS, TollBooth);
  }
}
