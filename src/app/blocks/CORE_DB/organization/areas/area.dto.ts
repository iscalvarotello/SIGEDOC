export class AreaDTO {
  id: string;
  name: string;
  acronym: string;
  connector: string;
  header: string;
  active: boolean;
  index_sort: number | null;
  parent_id: string | null;
  area_type_id: string;
  branch_id: string;
  reception_schedule: any | null;
  vobo_incidencia_id: string | null;
  personal_fields_document?: string[] | null;

  // Campos de solo lectura (Output JSON)
  area_type?: string;
  parent_name?: string;
  branch?: string;
  city?: string;
  city_id?: string;
  state?: string;
  state_id?: string;
  country?: string;
  country_id?: string;
  children?: any[];

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.acronym = data.acronym || '';
    this.connector = data.connector || '';
    this.header = data.header || '';
    this.active = data.active !== undefined ? data.active : true;
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
    
    this.parent_id = data.parent_id || null;
    this.area_type_id = data.area_type_id || '';
    this.branch_id = data.branch_id || '';
    this.reception_schedule = data.reception_schedule || null;
    this.vobo_incidencia_id = data.vobo_incidencia_id || null;
    this.personal_fields_document = data.personal_fields_document || null;

    // Mapeo de salida
    this.area_type = data.area_type;
    this.parent_name = data.parent_name;
    this.branch = data.branch;
    this.city = data.city;
    this.city_id = data.city_id;
    this.state = data.state;
    this.state_id = data.state_id;
    this.country = data.country;
    this.country_id = data.country_id;
    this.children = data.children;
  }

  get full_name(): string {
    const parts = [];
    if (this.area_type) parts.push(this.area_type);
    if (this.connector) parts.push(this.connector);
    if (this.name) parts.push(this.name);
    return parts.join(' ');
  }
}
