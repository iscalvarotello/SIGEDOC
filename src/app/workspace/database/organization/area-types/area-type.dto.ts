import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class AreaTypeDTO extends BaseDto<AreaTypeDTO> implements IBaseEntity {
  id: string;
  name: string;
  hierarchy_order: number;
  active: boolean;
  index_sort: number | null;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.hierarchy_order = data.hierarchy_order !== undefined ? data.hierarchy_order : 1;
    this.active = data.active !== undefined ? data.active : true;
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
  }
}
