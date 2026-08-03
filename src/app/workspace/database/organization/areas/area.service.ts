import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS, ApiRouteConfig } from '@core/api/api-routes.config';
import { AreaDTO } from './area.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService extends BaseApiService<AreaDTO> {
  constructor() {
    super(ENDPOINT_KEYS.AREAS, AreaDTO);
  }

  getTree(areaId: string): Promise<any> {
    return this.executeSpecialRoute('getTree', { id: areaId });
  }

  addCustomDocumentField(areaId: string, fieldName: string): Promise<any> {
    return this.executeSpecialRoute('customFields', {}, { area_id: areaId, field_name: fieldName });
  }

  async getTemas(areaId: string): Promise<string[]> {
    const res = await this.executeSpecialRoute<any>('getTemas', { id: areaId });
    const data = res && res.data ? res.data : res;
    return data && Array.isArray(data.temas) ? data.temas : [];
  }

  async addTema(areaId: string, tema: string): Promise<string[]> {
    const current = await this.getTemas(areaId);
    if (current.includes(tema)) return current;
    
    const updated = [...current, tema];
    const body = { temas_document: { temas: updated } };
    
    const res = await this.executeSpecialRoute<any>('addTema', { id: areaId }, body);
    const updatedTemasObj = res && res.temas_document ? res.temas_document : {};
    return updatedTemasObj && Array.isArray(updatedTemasObj.temas) ? updatedTemasObj.temas : updated;
  }
}
