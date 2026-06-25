import { ClaseDocumentoId, ClaseDocumento, TipoDocumentoId, TipoDocumento } from '../interfaces/document.interface';

export const DOCUMENTO_MAP: Record<ClaseDocumentoId, ClaseDocumento> = {
  'memo'     : { id: 'memo'     , label: 'Memorándum'          , plural: 'Memorándums'           , label_boton_new: 'Nuevo', slug: 'memo'     , icon: 'description' , conector_d: 'del'   , conector_a: 'al'   } ,
  'oficio'   : { id: 'oficio'   , label: 'Oficio'              , plural: 'Oficios'               , label_boton_new: 'Nuevo', slug: 'oficio'   , icon: 'mail'        , conector_d: 'del'   , conector_a: 'al'   } ,
  'ti'       : { id: 'ti'       , label: 'Tarjeta Informativa' , plural: 'Tarjetas Informativas' , label_boton_new: 'Nueva', slug: 'T.I'      , icon: 'assignment'  , conector_d: 'de la' , conector_a: 'a la' } ,
  'circular' : { id: 'circular' , label: 'Circular'            , plural: 'Circulares'            , label_boton_new: 'Nueva', slug: 'circular' , icon: 'campaign'    , conector_d: 'de la' , conector_a: 'a la' } ,
};

export const TIPODOCUMENTO_MAP: Record<TipoDocumentoId, TipoDocumento> = {
  'directo'    : { id: 'directo'    , singular_masculino: 'Directo'    , plural_masculino: 'Directos'    , singular_femenino: 'Directa'    , plural_femenino: 'Directas'    } ,
  'gestionado' : { id: 'gestionado' , singular_masculino: 'Gestionado' , plural_masculino: 'Gestionados' , singular_femenino: 'Gestionada' , plural_femenino: 'Gestionadas' } ,
  'para_firma' : { id: 'para_firma' , singular_masculino: 'Para Firma' , plural_masculino: 'Para Firma'  , singular_femenino: 'Para Firma' , plural_femenino: 'Para Firma'  } ,
  'recibido'   : { id: 'recibido'   , singular_masculino: 'Recibido'   , plural_masculino: 'Recibidos'   , singular_femenino: 'Recibida'   , plural_femenino: 'Recibidas'   } ,
};