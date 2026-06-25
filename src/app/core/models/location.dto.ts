// CountryDTO y COUNTRY_REGIONS fueron movidos a blocks/CORE_DB/location/countries/country.dto.ts

export class StateDTO {
  id: string;
  index_state: number;
  name: string;
  zone?: string;
  state_code?: string;
  country_id: string;
  
  // Propiedades aplanadas devueltas por la consulta
  country?: string;
  emoji?: string;
  
  constructor(data: any = {}) {
    this.id = data.id_state || data.id;
    this.index_state = data.index_state;
    this.name = data.name || '';
    this.zone = data.zone;
    this.state_code = data.state_code;
    // Consideramos ambos posibles nombres por el aplanamiento del backend
    this.country_id = data.country_id || data.id_country || '';
    
    this.country = data.country;
    this.emoji = data.emoji;
    Object.assign(this, data);
  }
}

export class CityDTO {
  id: string;
  name: string;
  index_city?: number;
  zone?: string;
  latitude?: string;
  longitude?: string;
  state_id: string;

  // Propiedades aplanadas devueltas por la consulta
  state?: string;
  id_country?: string;
  country?: string;
  emoji?: string;
  
  constructor(data: any = {}) {
    this.id = data.id_city || data.id;
    // Notamos que la ciudad viene en el campo "city" en lugar de "name"
    this.name = data.city || data.name || '';
    this.index_city = data.index_city;
    this.zone = data.zone;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.state_id = data.state_id || data.id_state || '';
    
    this.state = data.state;
    this.id_country = data.id_country;
    this.country = data.country;
    this.emoji = data.emoji;
    Object.assign(this, data);
  }
}
