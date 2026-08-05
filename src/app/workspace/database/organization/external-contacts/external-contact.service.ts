import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { ExternalContactDTO } from './external-contact.dto';

@Injectable({
  providedIn: 'root'
})
export class ExternalContactService extends BaseApiService<ExternalContactDTO> {
  constructor() {
    super(ENDPOINT_KEYS.EXTERNAL_CONTACTS);
  }
}
