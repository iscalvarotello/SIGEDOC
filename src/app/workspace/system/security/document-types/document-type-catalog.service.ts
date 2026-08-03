import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { DocumentTypeCatalogDTO } from './document-type-catalog.dto';

@Injectable({ providedIn: 'root' })
export class DocumentTypeCatalogService extends BaseApiService<DocumentTypeCatalogDTO> {
  constructor() {
    super(ENDPOINT_KEYS.DOCUMENT_TYPE_CATALOGS, DocumentTypeCatalogDTO);
  }
}
