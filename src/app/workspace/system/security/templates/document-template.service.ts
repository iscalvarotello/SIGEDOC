import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { DocumentTemplateDTO } from './document-template.dto';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService extends BaseApiService<DocumentTemplateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.DOCUMENT_TEMPLATES, DocumentTemplateDTO);
  }
}
