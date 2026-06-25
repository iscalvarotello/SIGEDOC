import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { PermissionDTO } from './permission.dto';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseApiService<PermissionDTO> {
  constructor() {
    super(ENDPOINT_KEYS.PERMISSIONS, PermissionDTO);
  }

  /**
   * Obtiene la lista de permisos para un rol específico.
   * Llama a: GET /api/users/roles/:roleId/permissions
   */
  async getPermissionsByRole(roleId: string | number): Promise<PermissionDTO[]> {
    const url = this.buildUrl(`/users/roles/${roleId}/permissions`);
    const res = await this.handleRequest<any>(this.http.get<any>(url));
    const data = res && res.data !== undefined ? res.data : res;
    return this.mapData(data) as PermissionDTO[];
  }

  /**
   * Guarda o actualiza un permiso (Upsert).
   * Llama a: POST /api/users/permisos
   * Envía: { role_id, module_id, can_read, can_update }
   */
  async upsertPermission(payload: {
    role_id: number;
    module_id: number;
    can_read: boolean;
    can_update: boolean;
  }): Promise<PermissionDTO> {
    return this.create(payload);
  }
}
