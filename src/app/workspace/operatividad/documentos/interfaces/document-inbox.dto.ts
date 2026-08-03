import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

import { ClaseDocumentoId, TipoDocumentoId } from './document.interface';

export class DocumentInboxDTO extends BaseDto<DocumentInboxDTO> implements IBaseEntity {
  id!: string;
  num_doc!: string;
  asunto!: string;
  tema?: string | null;
  estatus_emisor!: string;
  estatus_receptor!: string | null;
  bandeja!: string;
  clase_documento!: ClaseDocumentoId;
  tipo_documento!: TipoDocumentoId;
  fecha_doc!: string | Date;
  updated_at!: string | Date;
  url_drive_edition!: string | null;
  id_drive_doc!: string | null;
  doc_reference!: string | null;
  contestacion_a!: string | null;
  respondido_con!: string | null;
  viene_de!: string | null;
  seguimiento_con!: string | null;
  contestacion_a_num_doc?: string | null;
  respondido_con_num_doc?: string | null;
  viene_de_num_doc?: string | null;
  seguimiento_con_num_doc?: string | null;
  instruccion!: string | null;
  comentarios!: string | null;
  medio_envio!: string;
  metodo_firma?: string;
  id_area_emisora!: string | number;
  id_area_remitente!: string | number;
  id_area_receptora!: string | number | null;
  id_turnado_a?: string | null;

  // Campos de acompañamiento de área (Opción A)
  id_area_solicitante?: string | number | null;
  id_area_revisor?: string | number | null;
  id_area_turnado_a?: string | number | null;
  id_area_destinatario_interno?: string | number | null;
  id_area_destinatario_atencion?: string | number | null;

  // Campos adicionales del diccionario de datos
  prioridad?: string | null;
  date_dispatch?: string | Date | null;
  date_received?: string | Date | null;
  acuse_pdf_url?: string | null;
  acuse_pdf_hash?: string | null;
  anexos_drive_folder_id?: string | null;

  // Nombres de personas
  remitente_nombre!: string | null;
  destinatario_nombre!: string | null;
  solicitante_nombre!: string | null;
  recibe_nombre!: string | null;
  turnado_a_nombre!: string | null;
  revisor_nombre?: string | null;

  // Áreas y puestos
  area_emisora!: string | null;
  area_emisora_connector!: string | null;
  area_emisora_type!: string | null;
  area_emisora_job_name!: string | null;
  area_emisora_job_position_connector!: string | null;
  area_emisora_job_connector!: string | null;
  area_emisora_job_connector_fem!: string | null;

  area_remitente!: string | null;
  area_remitente_connector!: string | null;
  area_remitente_type!: string | null;
  area_remitente_job_name!: string | null;
  area_remitente_job_position_connector!: string | null;
  area_remitente_job_connector!: string | null;
  area_remitente_job_connector_fem!: string | null;

  area_receptora!: string | null;
  area_receptora_connector!: string | null;
  area_receptora_type!: string | null;
  area_receptora_job_name!: string | null;
  area_receptora_job_position_connector!: string | null;
  area_receptora_job_connector!: string | null;
  area_receptora_job_connector_fem!: string | null;

  area_atencion!: string | null;
  area_atencion_connector!: string | null;
  area_atencion_type!: string | null;
  area_atencion_job_name!: string | null;
  area_atencion_job_position_connector!: string | null;
  area_atencion_job_connector!: string | null;
  area_atencion_job_connector_fem!: string | null;

  turnado_a_job_name!: string | null;
  turnado_a_job_position_connector!: string | null;
  turnado_a_job_connector!: string | null;
  turnado_a_job_connector_fem!: string | null;

  reviewers_history?: { name: string; job_position: string }[] | null;

  ccps!: {
    employee_id?: string;
    employee_prefix?: string | null;
    employee_name?: string | null;
    employee_first_surname?: string | null;
    employee_second_surname?: string | null;
    area_name: string;
    area_connector: string;
    area_type: string;
    job_name: string;
    job_position_connector: string;
    job_connector: string;
    job_connector_fem: string;
    motivo: string;
  }[];

  constructor(data?: Partial<DocumentInboxDTO>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
