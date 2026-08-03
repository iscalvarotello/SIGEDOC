import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export enum CategoryCar {
  MOTO       = 'MOTO'       ,    // Motocicletas
  CAR_PICKUP = 'CAR_PICKUP' ,    // Carros o camionetas pick up
  BUS        = 'BUS'        ,    // Autobuses de 2 o 4 Ejes
  TRUCK_4X   = 'TRUCK_4X'   ,    // Camiones pesados de 2 a 4 ejes
  TRUCK_6X   = 'TRUCK_6X'   ,    // Camiones pesados de 5 a 6 ejes
  TRUCK_9X   = 'TRUCK_9X'   ,    // Camiones pesados de 7 a 9 ejes
}

export class CarDTO extends BaseDto<CarDTO> implements IBaseEntity {
  id!: string;
  name!: string;
  marca!: string;
  modelo!: string;
  tipo!: string;
  placas!: string;
  rendimiento!: number;
  category!: CategoryCar;
  index_sort?: number | null;

  constructor(data: any) {
    super();
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.marca = data.marca;
      this.modelo = data.modelo;
      this.tipo = data.tipo;
      this.placas = data.placas;
      this.rendimiento = data.rendimiento;
      this.category = data.category;
      this.index_sort = data.index_sort;
    }
  }
}
