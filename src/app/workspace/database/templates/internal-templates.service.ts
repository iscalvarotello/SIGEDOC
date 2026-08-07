import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';

export interface InternalTemplateDTO {
  id?: string;
  name: string;
  content: string;
  document_class: string; // 'memo' | 'oficio' | 'ti' | 'circular'
  area_id: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InternalTemplatesService extends BaseApiService<InternalTemplateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.INTERNAL_TEMPLATES, null as any); // null as any because we might not have a class for plain mapping in frontend
  }
}
