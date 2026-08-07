export interface DocumentItem {
   id_documento            : number           ,

   // Logica de actualización
   create_at               : Date             , // Es la fecha de creación del registro
   update_at               : Date             , // Es la fecha de actualización del registro.

   // Logica de clasificacióm
   clase_documento         : ClaseDocumentoId , // 'memo' | 'oficio' | 'ti' | 'circular'
   tipo_documento          : TipoDocumentoId  , // 'directo' | 'gestionado' | 'Para firma' | 'Recibidos'
   id_area_emisora         : number           , // Es el id del área que emitio el documento
   area_emisora            : string           , // Es el nombre corto del área que emitio el documento. Por ejemplo. DAYSE
   
   //  Datos del solicitante. Es la persona que en si elabora el memo. Normalmente simples mortales que no firman
   id_solicitante          : number           , // Es el id del enpleado que elabora el memo. P Ej: 234 -> 'Tello'
   solicitante             : string           , // Es el nickame de la persona que elabora el memo. 

   // Datos del remitente
   id_area_remitente       : number           , // Es el id del área que solicita el memo. P Ej: 'SUBCOM' aunque si es un memo directo coincide con id_area_emisora
   id_remitente            : number           , // Es el id del remitente que elebora el memo. P. Ej: 234 -> 'Arturo de Jesus Rosales Morales'
   remitente               : string           , // Es el nickName del remitente. P. Ej. "DAYSE"
   remitente_detail        : string           , // Es la referencia completa P el: Arturo de Jesus Rosales Morales
                                                //                                 Director de Atención Y Servicios Empresariales
    // Datos del destinatario 
   id_destinatario         : number           , // Es el id del área que recibe el documentom, si es un memo o una T.I. En el caso de las circulares es un 0 y en el caso de oficio es un null
   id_destinarario_externo : number           , // Cuando es un oficio si el destinatario 
   destinatario            : string           ,
   destinatario_detail     : string           ,

   //Datos del documento
   folio                   : number           , // 98
   num_doc                 : string           , // P Ej: SEYT/SC/098/2026
   fecha                   : Date             , // Es la que el usuario le puso como fecha al documento. Puede ser diferente de la fecha de creación porque hay documentos post-fechados
   temas                   : string           , // 
   asunto                  : string           , //
   link_edit               : string           , // Es la url para editar el documento en google drive
   link_acuse              : string           , // Es la url para descargar el acuse de recibido.
   recibe                  : string           , // Nickname de la persona que recibe el documento: Anita, Fili, etc
   estatus                 : Estatus          , // 'En edición','En firma','En espera','Entregado','Cancelado'
   medio_envio             : MedioEnvio       , // 'sin enviar','directo','sistema','correo','postal','whatsapp'

    // Campos de acompañamiento de área (Opción A)
    id_area_solicitante?    : number           ,
    id_area_revisor?        : number           ,
    id_area_turnado_a?      : number           ,
    id_area_destinatario_interno?: number      ,
    id_area_destinatario_atencion?: number     ,

    // Campos adicionales del diccionario de datos
    prioridad?              : string           ,
    date_dispatch?          : Date             ,
    date_received?          : Date             ,
    acuse_pdf_url?          : string           ,
    acuse_pdf_hash?         : string           ,
    anexos_drive_folder_id? : string           ,
}

export type ClaseDocumentoId    = 'memo'        | 'oficio'      | 'ti'         | 'circular';
export type TipoDocumentoId     = 'directo'     | 'gestionado'  | 'para_firma' | 'recibido'   ;
export type Estatus             = 'En edición'  | 'En revision' | 'En espera'  | 'Entregado' | 'Cancelado' ;
export type MedioEnvio          = 'sin enviar'  | 'directo'     | 'sistema'    | 'correo'    | 'postal'    | 'whatsapp' ;

export interface ClaseDocumento {
  id              : ClaseDocumentoId    ;
  label           : string ;
  plural          : string              ;
  label_boton_new : string              ;  
  slug            : string              ; // Para rutas o lógica interna
  icon            : string              ; // Clases de Heroicons o Lucide
  conector_d      : string              ; // Preposición para conectar: 'del', 'de la'. P ej. Del Memorándum, de la Circular, etc.
  conector_a      : string              ; // Preposición para conectar: 'al', 'a la'. P ej. Al Memorándum, a la Circular, etc.
}

export interface TipoDocumento {
  id                 : TipoDocumentoId ;
  singular_masculino : string ;
  plural_masculino   : string ;
  singular_femenino  : string ;
  plural_femenino    : string ;
}

export interface UserDocument {
  id_area_base   : number ;
  claseDocumento : ClaseDocumentoId ;
  tipoDocumento  : TipoDocumentoId ;
}