import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class StateDTO extends BaseDto<StateDTO> implements IBaseEntity {
  id: string;
  name: string;
  zone: string;
  fix: boolean;
  index_state: number;
  state_code: string;
  country: string;
  country_id: string;
  emoji: string;

  // Propiedades Virtuales para UI
  get fullName(): string {
    return `${this.emoji || ''} ${this.name}`;
  }

  constructor(data: any) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.zone = data.zone || '';
    this.fix = data.fix || false;
    this.index_state = data.index_state || 0;
    this.state_code = data.state_code || '';
    
    // Si data.country es un objeto (TypeORM relation), extraemos el name. Si no, lo usamos tal cual.
    if (typeof data.country === 'object' && data.country !== null) {
      this.country = data.country.name || '';
      this.country_id = data.country_id || data.country.id || '';
    } else {
      this.country = data.country || '';
      this.country_id = data.country_id || '';
    }

    this.emoji = data.emoji || '';
  }
}
