export class OfficialRecipientDTO {
  id: string;
  nombre: string;
  puesto: string;
  empresa_dependencia: string;
  telefono: string;
  email: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.nombre = data.nombre || '';
    this.puesto = data.puesto || '';
    this.empresa_dependencia = data.empresa_dependencia || '';
    this.telefono = data.telefono || '';
    this.email = data.email || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
