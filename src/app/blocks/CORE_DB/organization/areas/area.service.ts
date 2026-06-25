import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/api/base-api.service';
import { ENDPOINT_KEYS, ApiRouteConfig } from '../../../../core/api/api-routes.config';
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

  getTemas(areaId: string): Promise<string[]> {
    return this.executeSpecialRoute('getTemas', { id: areaId });
  }

  addTema(areaId: string, tema: string): Promise<any> {
    return this.executeSpecialRoute('addTema', { id: areaId }, { tema });
  }
}
