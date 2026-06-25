export class DocumentTypeCatalogDTO {
  id!: string;
  code!: string;
  name!: string;
  active!: boolean;
  index_order!: number | null;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.code = data.code || '';
    this.name = data.name || '';
    this.active = data.active !== undefined ? !!data.active : true;
    this.index_order = data.index_order !== undefined && data.index_order !== null ? Number(data.index_order) : null;

    // Asignación de seguridad para capturar otras propiedades adicionales del backend
    Object.assign(this, data);
  }
}
