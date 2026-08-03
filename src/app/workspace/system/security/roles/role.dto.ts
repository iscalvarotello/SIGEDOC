import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class RoleDTO extends BaseDto<RoleDTO> implements IBaseEntity {
  id: number;
  name: string;
  description: string;

  constructor(data: any = {}) {
    super();
    this.id = data.id !== undefined ? Number(data.id) : 0;
    this.name = data.name || '';
    this.description = data.description || '';
  }
}
