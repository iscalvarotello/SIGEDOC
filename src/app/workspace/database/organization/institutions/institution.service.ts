import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { InstitutionDTO } from './institution.dto';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService extends BaseApiService<InstitutionDTO> {
  constructor() {
    super(ENDPOINT_KEYS.INSTITUTIONS, InstitutionDTO);
  }

  addBranches(institutionId: string, branchIds: string[]) {
    const url = this.buildUrl(`${this.configPackage.base}/${institutionId}/branches`);
    return this.http.post<any>(url, { branchIds });
  }

  removeBranches(institutionId: string, branchIds: string[]) {
    const url = this.buildUrl(`${this.configPackage.base}/${institutionId}/branches`);
    return this.http.request<any>('DELETE', url, { body: { branchIds } });
  }

  uploadAssets(institutionId: string, formData: FormData) {
    const url = this.buildUrl(`${this.configPackage.base}/${institutionId}/assets`);
    return this.http.post<InstitutionDTO>(url, formData);
  }
}
