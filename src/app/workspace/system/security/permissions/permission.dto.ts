import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class PermissionDTO extends BaseDto<PermissionDTO> implements IBaseEntity {
  id?: string;
  role_id: number;
  module_id: number;
  can_read: boolean;
  can_update: boolean;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.role_id = data.role_id || data.role?.id || 0;
    this.module_id = data.module_id || data.module?.id || 0;
    this.can_read = data.can_read !== undefined ? !!data.can_read : false;
    this.can_update = data.can_update !== undefined ? !!data.can_update : false;
  }
}
