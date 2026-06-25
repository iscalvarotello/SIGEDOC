import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/core/api/base-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { UserDTO } from './user.dto';
import { GlobalCacheConfig } from '@app/shared/components/master-detail/master-detail.interfaces';
import { DBResponse } from '@app/core/api/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService<UserDTO> {
  constructor() {
    super(ENDPOINT_KEYS.USERS, UserDTO);
  }

  /**
   * Sobreescribimos getAll para forzar active: true y obtener siempre usuarios activos.
   */
  override getAll(
    queryParams?: any,
    cacheConfig?: GlobalCacheConfig,
    forceRefresh = false
  ): Promise<DBResponse<UserDTO[]>> {
    const params = { ...queryParams, active: true };
    return super.getAll(params, cacheConfig, forceRefresh);
  }

  async changePassword(userId: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('changePassword', { id: userId }, payload);
  }

  async resetPassword(userId: string): Promise<any> {
    return this.executeSpecialRoute('resetPassword', { idUser: userId });
  }

  async uploadProfilePhoto(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.executeSpecialRoute('uploadProfilePhoto', {}, formData);
  }
}
