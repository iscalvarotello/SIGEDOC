import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class OfficialRecipientDTO extends BaseDto<OfficialRecipientDTO> implements IBaseEntity {
  id: string;
  nombre: string;
  puesto: string;
  empresa_dependencia: string;
  telefono: string;
  email: string;
  curp: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.nombre = data.nombre || '';
    this.puesto = data.puesto || '';
    this.empresa_dependencia = data.empresa_dependencia || '';
    this.telefono = data.telefono || '';
    this.email = data.email || '';
    this.curp = data.curp || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
