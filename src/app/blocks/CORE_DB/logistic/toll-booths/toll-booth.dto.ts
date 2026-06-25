export interface TollBoothDTO {
  id: number;
  name: string;
  moto: number;
  car_pickup: number;
  bus: number;
  truck_4x: number;
  truck_6x: number;
  truck_9x: number;
  eea: number;
  eec: number;
  isActive: boolean;
  index_sort: number | null;
}

export class TollBooth implements TollBoothDTO {
  id!: number;
  name!: string;
  moto!: number;
  car_pickup!: number;
  bus!: number;
  truck_4x!: number;
  truck_6x!: number;
  truck_9x!: number;
  eea!: number;
  eec!: number;
  isActive!: boolean;
  index_sort!: number | null;

  constructor(data: any) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
