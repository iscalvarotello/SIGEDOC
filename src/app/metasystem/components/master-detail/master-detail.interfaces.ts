export interface ColumnConfig {
  key: string;       // Propiedad a leer del objeto
  label: string;     // Título de la columna
  width?: string;    // Clase Tailwind para ancho (ej. 'w-24' o 'w-[20%]')
  align?: 'left' | 'center' | 'right';
  isAction?: boolean; // Si es true, renderiza botones de acción en lugar del texto
  type?: 'text' | 'image' | 'boolean' | 'date'; // Tipo de columna
  booleanLabels?: { trueLabel: string, falseLabel: string }; // Custom text for boolean values
  imageEndpointKey?: string; // Para usar <server-image> (ej. 'INSTITUTIONS')
  imageRouteKey?: string;    // Para usar <server-image> (ej. 'getLogo')
}

export interface HeaderConfig {
  emojiField?: string;
  titleField: string;
  subtitleField?: string;
  subtitleLabel?: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  prefix?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'enum' | 'link';
  
  // Novedad: Opciones para type 'enum'
  options?: { value: any, label: string }[];
  
  // Novedad: Custom Labels para type 'boolean'
  booleanLabels?: { trueLabel: string, falseLabel: string };

  // Novedad: Builder para type 'link'
  linkBuilder?: (data: any) => string;
}

export interface GlobalCacheConfig {
  enabled: boolean;
  key: string;       // Llave base para el caché, ej. 'COUNTRIES'
  ttlMinutes?: number;
}

export interface MatrixColumnConfig {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  type?: 'text' | 'number' | 'currency' | 'boolean';
}

export interface MatrixGroupConfig {
  title: string;
  columns: MatrixColumnConfig[];
}

export interface PageControllerConfig {
  mainRoute: string;                  // Ruta principal (ej. '/database/location/countries')
  tableType?: 'data-table' | 'matrix-table'; // Estrategia de tabla a usar (por defecto data-table)
  tableColumns: ColumnConfig[];       // Configuración de la tabla estándar
  matrixGroups?: MatrixGroupConfig[]; // Configuración para encabezados agrupados (matrix-table)
  detailHeader: HeaderConfig;         // Configuración de la cabecera del detalle
  detailFields: FieldConfig[];        // Configuración de los campos de detalle
  sortConfig?: { key: string, direction: 'asc' | 'desc' }; // Ordenamiento inicial
  searchFields?: string[];            // Campos en los que la búsqueda global operará
  cacheConfig?: GlobalCacheConfig;    // Configuración opcional de caché global
  deferLoading?: boolean;             // Si es true, BasePage NO llamará a loadData automáticamente en ngOnInit
  fetchRoute?: string;                // Nombre de la 'specialRoute' a utilizar en vez de getAll (ej. 'byCountry')
}
