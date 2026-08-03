import { FormGroupConfig } from '@interfaces/dynamic-form.interface';
import { DOCUMENT_TYPE_OPTIONS } from '../document-type.enum';

export const DOCUMENT_TYPE_CATALOG_FORM_CONFIG: FormGroupConfig[] = [
  {
    title: 'Clasificación del Tipo de Documento',
    subtitle: 'Selecciona el código interno del sistema y establece un nombre legible.',
    fields: [
      { key: 'code', label: 'Código de Sistema', type: 'enum', options: DOCUMENT_TYPE_OPTIONS, required: true, gridSpan: 1 },
      { key: 'name', label: 'Nombre Descriptivo', type: 'text', required: true, placeholder: 'Ej. Formato de Boletos de Avión', gridSpan: 1 },
      { key: 'index_order', label: 'Índice de Ordenamiento', type: 'number', placeholder: 'Ej. 1 (dejar vacío para null)', gridSpan: 1 },
      { key: 'active', label: '¿Habilitado para su Uso?', type: 'boolean', defaultValue: true, gridSpan: 1 }
    ]
  }
];
