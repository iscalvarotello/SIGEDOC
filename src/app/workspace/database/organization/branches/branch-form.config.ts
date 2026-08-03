import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const BRANCH_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/organization/branches',
  cacheKeyToInvalidate: 'BRANCHES',
  keysToOmitOnSubmit: ['country_id', 'state_id'],
  formConfig: [
    {
      title: 'Ubicación Geográfica',
      subtitle: 'Seleccione la ciudad donde se ubica esta Sede Física.',
      fields: [
        { key: 'country_id' , label: 'ID País'             , type: 'hidden' , hideOnCreate  : true , hideOnEdit: true } ,
        { key: 'state_id'   , label: 'ID Estado'           , type: 'hidden' , hideOnCreate  : true , hideOnEdit: true } ,
        { key: 'city_id'    , label: 'Filtro de Ubicación' , type: 'custom' , customTypeKey : 'LOCATION_FILTER', customProps: { layout: 'vertical'}, required: true, gridSpan: 2 }
      ]
    },
    {
      title: 'Datos Generales de la Sede',
      fields: [
        { key: 'name'       , label: 'Nombre de la Sede'  , type: 'text'    , placeholder: 'Ej. Anexo Torre Chiapas, Nivel 1' , gridSpan: 2 , required: true } ,
        { key: 'address'    , label: 'Dirección Completa' , type: 'text'    , placeholder: 'Calle, Número, Colonia, C.P.'     , gridSpan: 2 , required: true } ,
        { key: 'is_central' , label: 'Sede Central'       , type: 'boolean' , placeholder: '¿Es la oficina central?'          , gridSpan: 1 , defaultValue: false } ,
        { key: 'active'     , label: 'Activo'             , type: 'boolean' , placeholder: '¿Se encuentra en operaciones?'    , gridSpan: 1 , defaultValue: true  } ,
        { key: 'index_sort' , label: 'Orden (Índice)'     , type: 'number'  , placeholder: 'Ej. 1'                            , gridSpan: 1 }
      ]
    }
  ]
};
