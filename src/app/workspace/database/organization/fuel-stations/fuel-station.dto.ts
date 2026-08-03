import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class FuelStationDTO extends BaseDto<FuelStationDTO> implements IBaseEntity {
  id: string;
  supplier_id: string;
  name: string;
  razon_social: string;
  address: string;
  cp: string;
  location: string;
  city_id: string;
  state_id: string;
  country_id: string;
  index_sort: number | null;
  active: boolean;

  // Campos calculados/solo lectura devueltos por la API
  supplier_name?: string;
  supplier_razon_social?: string;
  supplier_active?: boolean;
  city_name?: string;
  state_name?: string;
  country_name?: string;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.supplier_id = data.supplier_id || '';
    this.name = data.name || '';
    this.razon_social = data.razon_social || '';
    this.address = data.address || '';
    this.cp = data.cp || '';
    this.location = data.location || '';
    this.city_id = data.city_id || '';
    this.state_id = data.state_id || '';
    this.country_id = data.country_id || '';
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
    this.active = data.active !== undefined ? data.active : true;
    this.supplier_name = data.supplier_name;
    this.supplier_razon_social = data.supplier_razon_social;
    this.supplier_active = data.supplier_active;
    this.city_name = data.city_name;
    this.state_name = data.state_name;
    this.country_name = data.country_name;
  }
}
