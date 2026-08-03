import { FormGroupConfig } from '@interfaces/dynamic-form.interface';
import { SupplierType } from './supplier.dto';

export const SUPPLIER_FORM_CONFIG: FormGroupConfig[] = [
  {
    title: 'Información General',
    subtitle: 'Datos principales de identificación del proveedor',
    fields: [
      {
        key: 'name',
        label: 'Nombre Comercial',
        type: 'text',
        required: true,
        placeholder: 'Ej. Holiday Inn',
        gridSpan: 1
      },
      {
        key: 'razon_social',
        label: 'Razón Social',
        type: 'text',
        required: true,
        placeholder: 'Ej. OPERADORA DE ESTANCIAS S.A. DE C.V.',
        gridSpan: 1
      },
      {
        key: 'rfc',
        label: 'RFC',
        type: 'text',
        required: true,
        placeholder: 'Ej. XAXX010101000',
        gridSpan: 1
      },
      {
        key: 'type',
        label: 'Tipo de Proveedor',
        type: 'enum',
        required: true,
        gridSpan: 1,
        options: [
          { label: 'Servicio', value: SupplierType.Service },
          { label: 'Combustible', value: SupplierType.Fuel },
          { label: 'Material', value: SupplierType.Material }
        ]
      },
      {
        key: 'telephone',
        label: 'Teléfono Principal',
        type: 'tel',
        required: false,
        placeholder: 'Ej. 961 123 4567',
        gridSpan: 1
      },
      {
        key: 'index_sort',
        label: 'Índice de Ordenamiento',
        type: 'number',
        required: false,
        placeholder: 'Ej. 1',
        gridSpan: 1
      },
      {
        key: 'active',
        label: 'Estatus del Proveedor',
        type: 'boolean',
        required: false,
        placeholder: 'Proveedor Activo',
        gridSpan: 2
      }
    ]
  },
  {
    title: 'Directorio de Contactos',
    subtitle: 'Lista de personas de contacto en esta empresa',
    fields: [
      {
        key: 'contacts',
        label: '',
        type: 'custom',
        customTypeKey: 'CONTACTS_ARRAY',
        required: false,
        gridSpan: 2
      }
    ]
  }
];
