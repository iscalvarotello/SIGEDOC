import { DocumentItem, ClaseDocumentoId, TipoDocumento, Estatus, MedioEnvio, ClaseDocumento } from '../interfaces/document.interface';



export const LIST_DOCUMENTS: DocumentItem[] = [
  {
    id_documento        : 1                         ,

    create_at           : new Date( '2026-03-18 09:10:05' )  ,
    update_at           : new Date( '2026-03-18 09:19:05' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'directo'                 ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 100                       , //
    solicitante         : 'Tello'                   , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 30                        , // En este caso coincide el id_area_emisora con el id_area_remitente, porque es directo
    id_remitente        : 112                       , // Es el id de la persona que firma el documeto. En este caso el director de DAYSE 
    remitente           : 'DAYSE'                   , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Arturo de Jesus Rosales Morales|Director de Atención y Servicios Empresariales' ,
 
    id_destinatario     : 200                       , // ID EMPLEADO LIC. CONRADO DELA CRUZ - SUBSECRETARIO DE COMERCIO
    id_destinarario_externo : 0                     , // Es cero porque es un memo, no un oficio
    destinatario        : 'SUBCOM'                  , // 
    destinatario_detail : 'Lic. Conrado de la Cruz Selvas|Subsecretario de Comercio' ,

    folio               : 1                         , // El pipe en el HTML lo pondrá como 001
    num_doc             : 'SEYT/SC/DAYSE/001/2026'  ,
    fecha               : new Date ( '2026-03-19' ) ,
    tema                : 'Licitacion 001'          ,
    asunto              : 'Solicitud de licitacion restringida',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
  {
    id_documento        : 2                         ,

    create_at           : new Date( '2026-03-18 11:21:51' )  ,
    update_at           : new Date( '2026-03-18 11:21:51' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'directo'                 ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 100                       , //
    solicitante         : 'Tello'                   , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 30                        , // En este caso coincide el id_area_emisora con el id_area_remitente, porque es directo
    id_remitente        : 112                       , // Es el id de la persona que firma el documeto. En este caso el director de DAYSE 
    remitente           : 'DAYSE'                   , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Arturo de Jesus Rosales Morales|Director de Atención y Servicios Empresariales' ,
 
    id_destinatario     : 200                       , // ID EMPLEADO LIC. CONRADO DELA CRUZ - SUBSECRETARIO DE COMERCIO
    id_destinarario_externo : 0                     , // Es cero porque es un memo, no un oficio
    destinatario        : 'SUBCOM'                  , // 
    destinatario_detail : 'Lic. Conrado de la Cruz Selvas|Subsecretario de Comercio' ,

    folio               : 2                         , // El pipe en el HTML lo pondrá como 001
    num_doc             : 'SEYT/SC/DAYSE/002/2026'  ,
    fecha               : new Date ( '2026-03-19' ) ,
    tema                : 'Licitacion 001'          ,
    asunto              : 'Solicitud de licitacion restringida',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
  {
    id_documento        : 3                         ,

    create_at           : new Date( '2026-03-18 11:22:12' )  ,
    update_at           : new Date( '2026-03-18 11:22:12' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'gestionado'              ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 100                       , //
    solicitante         : 'Tello'                   , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 35                        , // Aqui el id_area_emisora != id_area_remitente porque es gestionado. 
    id_remitente        : 200                       , // Es el id de la persona que firma el documeto. En este caso el subsecretario de comercio
    remitente           : 'SUBCOM'                  , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Lic. Conrado de la Cruz Selvas|Subsecretario de Comercio' ,
 
    id_destinatario     : 220                       ,
    id_destinarario_externo : 0                     ,
    destinatario        : 'UAA'                     ,
    destinatario_detail : 'Lic. Gemma|Jefa de la Unidad de Apoyo Aministrativo' ,

    folio               : 45                         , // El pipe en el HTML lo pondrá como 045 
    num_doc             : 'SEYT/SC/0/2026'           ,
    fecha               : new Date ( '2026-03-19' )  ,
    tema                : 'Licitacion 001'           ,
    asunto              : 'Solicitud de licitacion restringida',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
  {
    id_documento        : 4                         ,

    create_at           : new Date( '2026-03-18 11:23:05' )  ,
    update_at           : new Date( '2026-03-18 11:23:05' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'directo'                 ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 100                       , //
    solicitante         : 'Tello'                   , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 30                        , // En este caso coincide el id_area_emisora con el id_area_remitente, porque es directo
    id_remitente        : 112                       , // Es el id de la persona que firma el documeto. En este caso el director de DAYSE 
    remitente           : 'DAYSE'                   , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Arturo de Jesus Rosales Morales|Director de Atención y Servicios Empresariales' ,
 
    id_destinatario     : 200                       , // ID EMPLEADO LIC. CONRADO DELA CRUZ - SUBSECRETARIO DE COMERCIO
    id_destinarario_externo : 0                     , // Es cero porque es un memo, no un oficio
    destinatario        : 'SUBCOM'                  , // 
    destinatario_detail : 'Lic. Conrado de la Cruz Selvas|Subsecretario de Comercio' ,

    folio               : 3                         , // El pipe en el HTML lo pondrá como 001
    num_doc             : 'SEYT/SC/DAYSE/003/2026'  ,
    fecha               : new Date ( '2026-03-19' ) ,
    tema                : 'Licitacion 001'          ,
    asunto              : 'Solicitud de pago de factura',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
  {
    id_documento        : 5                         ,

    create_at           : new Date( '2026-03-18 11:24:15' )  ,
    update_at           : new Date( '2026-03-18 11:24:15' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'directo'                 ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 110                       , //
    solicitante         : 'Iseleng'                 , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 30                        , // En este caso Iseleng es la Jefa de departamento, pero pertenece a la Direccitón de Atención, por eso su id_area_remitente es  30 DAYSE
    id_remitente        : 112                       , // Es el id de la persona que firma el documeto. En este caso el director de DAYSE 
    remitente           : 'DAYSE'                   , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Arturo de Jesus Rosales Morales|Director de Atención y Servicios Empresariales' ,
 
    id_destinatario     : 220                       ,
    id_destinarario_externo : 0                     ,
    destinatario        : 'UAA'                     ,
    destinatario_detail : 'Lic. Gemma|Jefa de la Unidad de Apoyo Aministrativo' ,

    folio               : 4                         , // El pipe en el HTML lo pondrá como 001
    num_doc             : 'SEYT/SC/DAYSE/004/2026'  ,
    fecha               : new Date ( '2026-03-19' ) ,
    tema                : 'Licitacion 001'          ,
    asunto              : 'Solicitud de pago de factura',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
  {
    id_documento        : 6                         ,

    create_at           : new Date( '2026-03-18 11:24:15' )  ,
    update_at           : new Date( '2026-03-18 11:24:15' )  ,

    clase_documento     : 1                         , // Memo
    tipo_documento      : 'directo'                 ,
    id_area_emisora     : 30                        , // Dirección de Atención y Servicios Empresariales
    area_emisora        : 'DAYSE'                   , // Es la abreviatura del área que emite el documento

    id_solicitante      : 110                       , //
    solicitante         : 'Iseleng'                 , // Nickname del empleado que esta elaborando el memorandum  

    id_area_remitente   : 30                        , // En este caso Iseleng es la Jefa de departamento, pero pertenece a la Direccitón de Atención, por eso su id_area_remitente es  30 DAYSE
    id_remitente        : 112                       , // Es el id de la persona que firma el documeto. En este caso el director de DAYSE 
    remitente           : 'DAYSE'                   , // Nombre corto del área base que emite el documento
    remitente_detail    : 'Arturo de Jesus Rosales Morales|Director de Atención y Servicios Empresariales' ,
 
    id_destinatario     : 220                       ,
    id_destinarario_externo : 0                     ,
    destinatario        : 'UAA'                     ,
    destinatario_detail : 'Lic. Gemma|Jefa de la Unidad de Apoyo Aministrativo' ,

    folio               : 5                         , // El pipe en el HTML lo pondrá como 001
    num_doc             : 'SEYT/SC/DAYSE/005/2026'  ,
    fecha               : new Date ( '2026-03-19' ) ,
    tema                : 'Licitacion 001'          ,
    asunto              : 'Alcance al memo SEYT/SC/DAYSE/005/2026, cambio de domicilio del proveedor',
    link_edit           : 'https://docs.google.com/.../edit',
    link_acuse          : '',
    recibe              : '',
    estatus             : 'En edición'               ,
    medio_envio         : 'sin enviar'               ,
  },
];