import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { OfficialRecipientDTO } from './official-recipient.dto';

@Injectable({
  providedIn: 'root'
})
export class OfficialRecipientService extends BaseApiService<OfficialRecipientDTO> {
  constructor() {
    super(ENDPOINT_KEYS.OFFICIAL_RECIPIENTS, OfficialRecipientDTO);
  }
}
