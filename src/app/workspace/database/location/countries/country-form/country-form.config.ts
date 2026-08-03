import { FormGroupConfig } from '@interfaces/dynamic-form.interface';
import { COUNTRY_REGIONS } from '../country.dto';

export const COUNTRY_FORM_CONFIG: FormGroupConfig[] = [
  {
    title: 'Información General',
    subtitle: 'Datos principales de identificación del país.',
    fields: [
      { key: 'name', label: 'Nombre del País', type: 'text', required: true, placeholder: 'Ej. México', gridSpan: 1 },
      { key: 'emoji', label: 'Bandera (Emoji)', type: 'text', placeholder: 'Ej. 🇲🇽', gridSpan: 1 },
      { key: 'fix', label: '¿País Default?', type: 'boolean', placeholder: 'Establecer como país principal', gridSpan: 2 }]
  },
  {
    title: 'Ordenamiento Interno',
    subtitle: 'Manejo de índices para listas y vistas.',
    fields: [
      { key: 'index_country', label: 'Índice de Sistema', type: 'number', hideOnCreate: true, readonlyOnEdit: true, defaultValue: -1, gridSpan: 1  },
      { key: 'index_sort', label: 'Índice de Ordenamiento personalizado', type: 'number', defaultValue: -1, gridSpan: 1 }
    ]
  },
  {
    title: 'Códigos y Región',
    subtitle: 'Estándares internacionales y agrupación.',
    fields: [
      { key: 'iso2', label: 'Código ISO 2', type: 'text', required: true, placeholder: 'Ej. MX', gridSpan: 1 },
      { key: 'iso3', label: 'Código ISO 3', type: 'text', required: true, placeholder: 'Ej. MEX', gridSpan: 1 },
      { key: 'phonecode', label: 'Prefijo Telefónico', type: 'number', required: true, placeholder: 'Ej. 52', gridSpan: 1 },
      { key: 'region', label: 'Región Geográfica', type: 'enum', options: COUNTRY_REGIONS, gridSpan: 1 }, 
      { key: 'zone', label: 'Zona Económica (Pago)', type: 'enum', options: [
          { value: 'A', label: 'Zona A' },
          { value: 'B', label: 'Zona B' },
          { value: 'C', label: 'Zona C' }
        ],
        gridSpan: 1 
      }]
  }
];