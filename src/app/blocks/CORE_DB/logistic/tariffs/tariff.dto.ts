export enum EmployeeCategory {
  A = 'A', 
  B = 'B', 
  C = 'C', 
  D = 'D', 
  E = 'E', 
  F = 'F'
}

export enum TravelScope {
  STATE         = 'ESTATAL',
  NATIONAL      = 'NACIONAL',
  INTERNATIONAL = 'INTERNACIONAL'
}

export enum Currency {
  MXN = 'MXN',
  USD = 'USD'
}

export class TariffMatrixDTO {
  id?: string; // id proporcionado por el backend: CATEGORIA_ALCANCE_AÑO
  employ_category!: EmployeeCategory;
  travel_scope!: TravelScope;
  year!: number;
  currency!: Currency;
  
  zone_A_full_day!: number;
  zone_A_middle_day!: number;
  zone_B_full_day!: number;
  zone_B_middle_day!: number;
  zone_C_full_day!: number;
  zone_C_middle_day!: number;

  constructor(data: Partial<TariffMatrixDTO>) {
    Object.assign(this, data);
  }

  // Nombre para mostrar en confirmaciones de borrado, ej. "Categoría E - ESTATAL (2026)"
  get name(): string {
    return `Categoría ${this.employ_category} - ${this.travel_scope} (${this.year})`;
  }
}
