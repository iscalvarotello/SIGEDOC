export enum TravelScope {
  MUNICIPAL = 'MUNICIPAL',
  ESTATAL = 'ESTATAL',
  NACIONAL = 'NACIONAL',
  INTERNACIONAL = 'INTERNACIONAL'
}

export class DistanceDTO {
  id!: string;
  origin_city_id!: string;
  origin_state_id?: string;
  origin_country_id?: string;
  destination_city_id!: string;
  destination_state_id?: string;
  destination_country_id?: string;
  origin_city?: string;
  destination_city?: string;
  via!: string;
  distance_km!: number;
  travel_scope!: TravelScope;
  toll_booth_ids!: number[];
  index_sort?: number | null;
  moto!: number;
  car_pickup!: number;
  bus!: number;
  truck_4x!: number;
  truck_6x!: number;
  truck_9x!: number;
  eea!: number;
  eec!: number;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.origin_city_id = data.origin_city_id;
      this.origin_state_id = data.origin_state_id;
      this.origin_country_id = data.origin_country_id;
      this.destination_city_id = data.destination_city_id;
      this.destination_state_id = data.destination_state_id;
      this.destination_country_id = data.destination_country_id;
      this.origin_city = data.origin_city;
      this.destination_city = data.destination_city;
      this.via = data.via;
      this.distance_km = data.distance_km;
      this.travel_scope = data.travel_scope;
      this.toll_booth_ids = data.toll_booth_ids || [];
      this.index_sort = data.index_sort;
      this.moto = data.moto;
      this.car_pickup = data.car_pickup;
      this.bus = data.bus;
      this.truck_4x = data.truck_4x;
      this.truck_6x = data.truck_6x;
      this.truck_9x = data.truck_9x;
      this.eea = data.eea;
      this.eec = data.eec;
    }
  }
}
