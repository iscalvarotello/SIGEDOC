export class EmployeeDTO {
  id!: string; // ID de la adscripción
  is_head!: boolean;
  is_reception!: boolean;
  is_reviewer!: boolean;
  is_in_charge!: boolean;
  start_date!: string;
  end_date?: string | null;
  active!: boolean;

  // Empleado
  employee_id!: string;
  level?: string;
  category?: string;
  ref_doc?: string | null;
  check_number?: string | null;
  check_in_hour?: string | null;
  check_out_hour?: string | null;

  // Persona
  prefix?: string;
  name!: string;
  first_surname!: string;
  second_surname?: string;
  sex!: string; // 'H' o 'M'
  curp!: string;
  rfc!: string;
  email?: string;
  nickname?: string;

  // Puesto
  job_position_id!: string;
  job_position!: string;
  job_position_fem?: string;
  job_key?: string;
  connector?: string;
  job_connector?: string;
  job_connector_fem?: string;
  job_index_sort?: number | null;

  // Área
  area_id!: string;
  area_base_id!: string;
  area!: string;
  area_connector?: string;
  area_acronym?: string;
  area_header?: string;
  area_index_sort?: number | null;

  // Sucursal y ubicación
  branch?: string;
  city?: string;
  state?: string;
  country?: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.is_head = data.is_head !== undefined ? !!data.is_head : false;
    this.is_reception = data.is_reception !== undefined ? !!data.is_reception : false;
    this.is_reviewer = data.is_reviewer !== undefined ? !!data.is_reviewer : false;
    this.is_in_charge = data.is_in_charge !== undefined ? !!data.is_in_charge : false;
    this.active = data.active !== undefined ? !!data.active : true;
  }

  /**
   * Nombre completo del empleado en formato: Nombre Apellido1 Apellido2
   */
  get fullName(): string {
    return `${this.name || ''} ${this.first_surname || ''} ${this.second_surname || ''}`.replace(/\s+/g, ' ').trim();
  }

  /**
   * Devuelve la denominación del puesto en el género correcto (masculino o femenino)
   */
  get resolvedJobPosition(): string {
    if (this.sex === 'M' && this.job_position_fem) {
      return this.job_position_fem;
    }
    return this.job_position || 'Puesto no asignado';
  }

  /**
   * Formatea la cadena completa de Puesto + Conector de Área + Área
   */
  get fullJobAndArea(): string {
    const job = this.resolvedJobPosition;
    const conn = this.area_connector || '';
    const ar = this.area || '';
    return [job, conn, ar].filter(Boolean).join(' ');
  }

  /**
   * Etiqueta formateada del rol organizacional
   */
  get roleLabel(): string {
    if (this.is_in_charge) {
      return 'Encargado (Senescal) 👑';
    }
    if (this.is_head) {
      return 'Titular 🏛️';
    }
    if (this.is_reception) {
      return 'Recepción de Correspondencia 📨';
    }
    if (this.is_reviewer) {
      return 'Revisor de Documentos 📋';
    }
    return 'Personal Operativo';
  }
}
