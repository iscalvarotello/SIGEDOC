import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export enum SupplierType {
  Service = 'Service',
  Fuel = 'Fuel',
  Material = 'Material',
}

export interface ContactDTO {
  name: string;
  job: string;
  email: string;
  phone: string;
}

export interface SupplierAttachmentDTO {
  id_attachment: string;
  attachment_name: string;
  attachment_title: string;
  extension: string;
  orden?: number;
  year?: number;
  versionable: boolean;
}

export class SupplierDTO extends BaseDto<SupplierDTO> implements IBaseEntity {
  id: string;
  name: string;
  razon_social: string;
  rfc: string;
  type: SupplierType;
  telephone: string;
  index_sort: number | null;
  active: boolean;
  contacts: ContactDTO[];
  partidas: string[];
  attachments: SupplierAttachmentDTO[];

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.razon_social = data.razon_social || '';
    this.rfc = data.rfc || '';
    this.type = data.type || SupplierType.Service;
    this.telephone = data.telephone || '';
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
    this.active = data.active !== undefined ? data.active : true;
    
    // Arrays
    this.contacts = Array.isArray(data.contacts) ? data.contacts : [];
    this.partidas = Array.isArray(data.partidas) ? data.partidas : [];
    this.attachments = Array.isArray(data.attachments) ? data.attachments : [];
  }
}
