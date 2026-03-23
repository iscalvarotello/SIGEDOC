export interface DocumentItem {
   id_documento            : number           ,

   // Logica de actualización
   create_at               : Date             , // Es la fecha de creación del registro
   update_at               : Date             , // Es la fecha de actualización del registro.

   // Logica de clasificacióm
   clase_documento         : ClaseDocumentoId , // 1-> memo, 2-> oficio, 3-> tarjeta informativa, 4-> Circular
   tipo_documento          : TipoDocumento    , // 'directo' | 'gestionado' | 'Para firma' | 'Recibidos'
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
   tema                    : string           , // 
   asunto                  : string           , //
   link_edit               : string           , // Es la url para editar el documento en google drive
   link_acuse              : string           , // Es la url para descargar el acuse de recibido.
   recibe                  : string           , // Nickname de la persona que recibe el documento: Anita, Fili, etc
   estatus                 : Estatus          , // 'En edición','En firma','En espera','Entregado','Cancelado'
   medio_envio             : MedioEnvio       , // 'sin enviar','directo','sistema','correo','postal','whatsapp'
}

export type ClaseDocumentoId      = 1 | 2 | 3 | 4;
export type LabelClaseDocumento = 'Memorándum'  | 'Oficio'     | 'Tarjeta Informativa'   | 'Circular' ;
export type TipoDocumento       = 'directo'     | 'gestionado' | 'para_firma'            | 'recibido'   ;
export type Estatus             = 'En edición'  | 'En firma'   | 'En espera'             | 'Entregado' | 'Cancelado' ;
export type MedioEnvio          = 'sin enviar'  | 'directo'    | 'sistema'               | 'correo'    | 'postal'    | 'whatsapp' ;

export interface ClaseDocumento {
  id              : ClaseDocumentoId    ;
  label           : LabelClaseDocumento ;
  plural          : string              ;
  label_boton_new : string              ;  
  slug            : string              ; // Para rutas o lógica interna
  icon            : string              ; // Clases de Heroicons o Lucide
}
