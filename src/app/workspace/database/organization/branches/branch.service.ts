import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { BranchDTO } from './branch.dto';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseApiService<BranchDTO> {
  constructor() {
    super(ENDPOINT_KEYS.BRANCHES, BranchDTO);
  }
}
