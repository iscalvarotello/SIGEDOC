import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { ENDPOINT_KEYS } from '../../../../core/api/api-routes.config';
import { InternalTemplateDTO } from './internal-template.dto';

@Injectable({
  providedIn: 'root'
})
export class InternalTemplateService extends BaseApiService<InternalTemplateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.INTERNAL_TEMPLATES, InternalTemplateDTO);
  }
}
