export interface TagMetadata {
  tag: string;
  description: string;
  isAlive?: boolean;
  isDocumentOnly?: boolean;
  wrapperType: 'structural' | 'binding' | 'raw';
}

export const TAG_DICTIONARY: TagMetadata[] = [
  { tag: '{{HEADER}}', description: 'Cabecera alineada a la derecha', isDocumentOnly: true, wrapperType: 'structural' },
  { tag: '{{DOC_TYPE}}', description: 'Tipo de documento', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{NUM_DOC}}', description: 'Número de documento o folio', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{CITY}}', description: 'Ciudad de expedición', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{STATE}}', description: 'Estado de expedición', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{YEAR}}', description: 'Año en curso', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{DAY}}', description: 'Día del mes', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{MONTH}}', description: 'Mes en curso', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{TO}}', description: 'Destinatario del documento', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{FROM}}', description: 'Remitente del documento', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{BODY}}', description: 'Cuerpo principal del documento', isDocumentOnly: true, wrapperType: 'structural' },
  { tag: '{{MAKER}}', description: 'Quien elaboró el documento', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{EXTERNAL_REFERENCE}}', description: 'Referencia externa', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{USER_REFERENCE}}', description: 'Referencia de usuario (iniciales)', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{INTERNAL_REFERENCE}}', description: 'Referencia interna (consecutivo)', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{CCP}}', description: 'Con copia para', isAlive: true, isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{SUBJECT}}', description: 'Asunto del documento', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{NUM_EMPLOYEE}}', description: 'Número de empleado', isDocumentOnly: false, wrapperType: 'binding' },
  { tag: '{{CHECK_IN_NUMBER}}', description: 'Número de reloj checador', isDocumentOnly: false, wrapperType: 'binding' },
  { tag: '{{ATTACHED_TITLE}}', description: 'Título para los anexos', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{ATTACHED_LIST}}', description: 'Lista de anexos (legacy)', isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{__attachmen__}}', description: 'Título dinámico de anexos', isAlive: true, isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{__attachmen_list__}}', description: 'Lista dinámica de anexos', isAlive: true, isDocumentOnly: true, wrapperType: 'binding' },
  { tag: '{{__UUID__}}', description: 'Identificador único del documento', isDocumentOnly: true, wrapperType: 'raw' },
  { tag: '{{__URL__}}', description: 'URL pública de validación del documento', isDocumentOnly: true, wrapperType: 'raw' },
  { tag: '{{__footer__}}', description: 'Pie de página del área emisora', isDocumentOnly: true, wrapperType: 'structural' },
  { tag: '{{__HEADER_DOCUMENT__}}', description: 'Cabecera principal del documento', isDocumentOnly: false, wrapperType: 'structural' },
  { tag: '{{__break_page__}}', description: 'Salto de página (crea una nueva hoja)', isDocumentOnly: false, wrapperType: 'raw' },
  { tag: '{{__QR__}}', description: 'Código QR dinámico de validación', isDocumentOnly: true, wrapperType: 'raw' }
];
