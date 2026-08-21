import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { DocumentTemplateDTO } from './document-template.dto';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService extends BaseApiService<DocumentTemplateDTO> {
  constructor() {
    super(ENDPOINT_KEYS.DOCUMENT_TEMPLATES, DocumentTemplateDTO);
  }

  public async createWithFile(formData: FormData, cacheKeyToInvalidate?: string): Promise<DocumentTemplateDTO> {
    const url = this.apiRouter.getAllUrl();
    const response = await this.handleRequest<any>(this.http.post<any>(url, formData));
    if (cacheKeyToInvalidate) this.cacheManager.invalidateByBaseKey(cacheKeyToInvalidate);
    return this.mapData(response.data !== undefined ? response.data : response);
  }

  public async updateWithFile(id: string, formData: FormData, cacheKeyToInvalidate?: string): Promise<DocumentTemplateDTO> {
    const url = this.apiRouter.getByIdUrl(id);
    const response = await this.handleRequest<any>(this.http.patch<any>(url, formData));
    if (cacheKeyToInvalidate) this.cacheManager.invalidateByBaseKey(cacheKeyToInvalidate);
    return this.mapData(response.data !== undefined ? response.data : response);
  }
}
