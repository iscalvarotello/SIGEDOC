import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export class DocumentTemplateDTO extends BaseDto<DocumentTemplateDTO> implements IBaseEntity {
  id!: string;
  name!: string;
  google_drive_id?: string;
  url?: string;
  word_file_path?: string;
  type!: 'blank' | 'custom';
  document_type_catalog_id!: string;
  type_doc_code?: string;
  type_doc_name?: string;
  owner_id?: string | null;
  owner_name?: string | null;
  index_order!: number | null;
  active!: boolean;

  get typeLabel(): string {
    return this.type === 'blank' ? 'En Blanco 📄' : 'Personalizada 🛠️';
  }

  constructor(data: any = {}) {
    super();
    this.id = data.id_template || data.id || '';
    this.name = data.name_template || data.name || '';
    this.google_drive_id = data.google_drive_id_template || data.google_drive_id || '';
    this.url = data.url || '';
    this.word_file_path = data.word_file_path || '';
    this.type = data.type_template || data.type || 'blank';

    // Tipo de Documento Relacionado
    this.document_type_catalog_id = data.type_doc_template_id || data.document_type_catalog_id || (data.type_doc?.id) || '';
    this.type_doc_code = data.type_doc_code || (data.type_doc?.code) || '';
    this.type_doc_name = data.type_doc_name || (data.type_doc?.name) || '';

    // Área Propietaria (Owner)
    if (data.owner_template) {
      this.owner_id = typeof data.owner_template === 'object' ? data.owner_template.id : data.owner_template;
      this.owner_name = typeof data.owner_template === 'object' ? data.owner_template.name : null;
    } else {
      this.owner_id = data.owner_id || (data.owner?.id) || null;
      this.owner_name = data.owner?.name || null;
    }

    // Ordenamiento y Estado
    this.index_order = data.index_order !== undefined && data.index_order !== null ? Number(data.index_order) : null;
    this.active = data.active_template !== undefined ? !!data.active_template : (data.active !== undefined ? !!data.active : true);

    // Asignación de seguridad para capturar otras propiedades
    Object.assign(this, data);
  }
}
