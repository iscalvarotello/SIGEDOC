import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class BranchDTO extends BaseDto<BranchDTO> implements IBaseEntity {
  id: string;
  name: string;
  address: string;
  is_central: boolean;
  index_sort: number | null;
  city?: string;
  city_id?: string;
  state?: string;
  state_id?: string;
  country?: string;
  country_id?: string;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.address = data.address || '';
    this.is_central = data.is_central || false;
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
    this.city = data.city;
    this.city_id = data.city_id;
    this.state = data.state;
    this.state_id = data.state_id;
    this.country = data.country;
    this.country_id = data.country_id;
  }
}
