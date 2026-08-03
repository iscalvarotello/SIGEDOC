import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class CityDTO extends BaseDto<CityDTO> implements IBaseEntity {
  id: string;
  city: string;
  state?: string;
  state_id?: string;
  latitude: string;
  longitude: string;
  country?: string;
  country_id?: string;
  emoji?: string;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.city = data.city || '';
    this.state = data.state;
    this.state_id = data.state_id;
    this.latitude = data.latitude || '';
    this.longitude = data.longitude || '';
    this.country = data.country;
    this.country_id = data.country_id;
    this.emoji = data.emoji;

    // Si la relación viene poblada, extraer
    if (data.state && typeof data.state === 'object') {
      this.state = data.state.name;
      this.state_id = data.state.id;
    }
    
    if (data.country && typeof data.country === 'object') {
      this.country = data.country.name;
      this.country_id = data.country.id;
      this.emoji = data.country.emoji;
    }

    Object.assign(this, data);
  }
}
