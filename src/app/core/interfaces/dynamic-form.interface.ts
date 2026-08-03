export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttlMinutes?: number; // Si no se provee o es 0, el caché dura infinito
}

export interface ApiSelectConfig {
  configKey: string;                          // Ej. 'LOCATION_COUNTRY' (llave en ApiRouteConfig)
  valueKey: string;                           // Ej. 'id'
  labelKey: string | ((item: any) => string); // Ej. 'name' o una función
  dependsOnField?: string;                    // Ej. 'country_id'
  dependencyQueryParam?: string;              // Ej. 'countryId'
  staticQueryParams?: Record<string, any>;    // Ej. { type: 'Fuel' }
  cache?: CacheConfig;                        // Configuración del caché en memoria
  multiple?: boolean;                         // Si es true, renderiza checkboxes para selección múltiple
}

export interface FormFieldConfig {
  key: string;               // Identificador y llave en el FormGroup / DTO
  label: string;             // Etiqueta visual
  type: 'text' | 'password' | 'number' | 'email' | 'tel' | 'date' | 'enum' | 'api-select' | 'boolean' | 'custom' | 'hidden' | 'textarea' | 'country-select' | 'state-select' | 'city-select'; // Tipo de control
  options?: FormFieldOption[]; // Opciones para el tipo 'enum'
  apiConfig?: ApiSelectConfig; // Configuración para el tipo 'api-select'
  customTypeKey?: string;    // Para el futuro: clave para invocar controles complejos (ej. 'MAP_SELECTOR' o 'LOCATION_FILTER')
  customProps?: any;         // Propiedades extras que el componente custom necesite (ej. layout: 'vertical')
  required?: boolean;        // Validación
  placeholder?: string;      // Placeholder visual
  gridSpan?: number;         // Ancho en un grid de columnas (ej. 1 = mitad, 2 = fila completa)
  
  // Propiedades Condicionales y de Estado
  hideOnCreate?: boolean;    // No renderizar si isEditMode = false
  hideOnEdit?: boolean;      // No renderizar si isEditMode = true
  readonlyOnCreate?: boolean;// Bloquear si isEditMode = false
  readonlyOnEdit?: boolean;  // Bloquear si isEditMode = true
  defaultValue?: any;        // Valor inicial por defecto al instanciar el form (al crear)
}

export interface FormGroupConfig {
  title?: string;            // Título de la sección
  subtitle?: string;         // Descripción de la sección
  fields: FormFieldConfig[]; // Campos que pertenecen a este grupo
}

export interface FormControllerConfig {
  mainRoute: string;             // Ruta de retorno tras cancelar o guardar (ej. '/database/location/countries')
  formConfig: FormGroupConfig[]; // Configuración visual del formulario
  cacheKeyToInvalidate?: string; // Llave de caché a invalidar tras guardar/editar
  keysToOmitOnSubmit?: string[]; // Llaves a omitir del payload al enviar al backend
}
