import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { SupplierDTO } from './supplier.dto';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseApiService<SupplierDTO> {
  constructor() {
    super(ENDPOINT_KEYS.SUPPLIERS, SupplierDTO);
  }

  async updateAttachments(supplierId: string, attachments: any[]): Promise<SupplierDTO> {
    const res = await this.executeSpecialRoute('updateAttachments', { id: supplierId }, { attachments });
    return new SupplierDTO(res);
  }
}
