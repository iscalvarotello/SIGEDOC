import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { HtmlTemplate, HtmlTemplateTag } from '../interfaces/html-template.interface';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { DBResponse } from '@core/api/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HtmlTemplateService extends BaseApiService<HtmlTemplate> {
  constructor() {
    super(ENDPOINT_KEYS.HTML_TEMPLATES);
  }

  public async getTags(): Promise<HtmlTemplateTag[]> {
    const res = await this.executeSpecialRoute<HtmlTemplateTag[]>('getTags');
    return res && (res as any).data ? (res as any).data : res;
  }

  public async findAll(): Promise<HtmlTemplate[]> {
    const res = await this.getAll();
    return res.data;
  }

  public async findOne(id: string): Promise<HtmlTemplate> {
    const res = await this.getById(id);
    return res;
  }

  public async createTemplate(data: Partial<HtmlTemplate>): Promise<HtmlTemplate> {
    const res = await this.create(data);
    return res;
  }

  public async updateTemplate(id: string, data: Partial<HtmlTemplate>): Promise<HtmlTemplate> {
    const res = await this.update(id, data);
    return res;
  }

  public async removeTemplate(id: string): Promise<void> {
    await this.delete(id);
  }
}
