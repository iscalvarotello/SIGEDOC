import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export const COUNTRY_REGIONS = [
  { value: 'NORTE_AMERICA', label: 'Norte América' },
  { value: 'LATINO_AMERICA', label: 'Latinoamérica' },
  { value: 'EUROPA_OCCIDENTAL', label: 'Europa Occidental' },
  { value: 'EUROPA_ORIENTAL', label: 'Europa Oriental' },
  { value: 'ORIENTE_PROXIMO', label: 'Oriente Próximo' },
  { value: 'MEDIO_ORIENTE', label: 'Medio Oriente' },
  { value: 'LEJANO_ORIENTE', label: 'Lejano Oriente' },
  { value: 'AFRICA_DEL_NORTE', label: 'África del Norte' },
  { value: 'AFRICA_CENTRAL', label: 'África Central' },
  { value: 'SUDAFRICA', label: 'Sudáfrica' },
  { value: 'OCEANIA', label: 'Oceanía' }
];

export class CountryDTO extends BaseDto<CountryDTO> implements IBaseEntity {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  zone?: string;
  phonecode: string;
  emoji?: string;
  icon?: string;
  
  // Nuevos campos
  index_country: number;
  index_sort: number;
  fix: boolean;
  region?: string;
  fullName?: string;
  
  constructor(data: any = {}) {
    super();
    this.id = data.id_country || data.id;
    this.name = data.name || '';
    this.iso2 = data.iso2 || '';
    this.iso3 = data.iso3 || '';
    this.zone = data.zone;
    this.phonecode = data.phonecode || '';
    this.emoji = data.emoji;
    this.icon = data.icon;
    
    // Asignación de nuevos campos
    this.index_country = data.index_country ?? -1;
    this.index_sort = data.index_sort ?? 0;
    this.fix = !!data.fix;
    this.region = data.region;
    this.fullName = data.fullName;
    
    // Capturamos cualquier otra propiedad adicional que llegue del backend
    Object.assign(this, data);
  }
}
