export class InternalTemplateDTO {
  id: string;
  name: string;
  body: string;
  area_id: string | null;
  area_name: string | null;
  tipo_documento: string | null;
  active: boolean;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.body = data.body || '';
    this.area_id = data.area_id || null;
    this.area_name = data.area_name || null;
    this.tipo_documento = data.tipo_documento || null;
    this.active = data.active !== undefined ? data.active : true;
  }
}

