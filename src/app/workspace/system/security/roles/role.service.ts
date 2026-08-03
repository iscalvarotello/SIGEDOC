import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { RoleDTO } from './role.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseApiService<RoleDTO> {
  constructor() {
    super(ENDPOINT_KEYS.ROLES, RoleDTO);
  }
}
