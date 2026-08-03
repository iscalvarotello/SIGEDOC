import { FormGroupConfig } from '@interfaces/dynamic-form.interface';
export const FUEL_STATION_FORM_CONFIG: FormGroupConfig[] = [
  {
    title: 'Dependencia (Proveedor)',
    fields: [
      {
        key: 'supplier_id',
        label: 'Proveedor (Gasolinero)',
        type: 'api-select',
        required: true,
        apiConfig: {
          configKey: 'SUPPLIERS',
          valueKey: 'id',
          labelKey: 'name',
          staticQueryParams: { type: 'Fuel' }
        },
        readonlyOnCreate: true, // Bloqueado, se inyecta desde la URL
        readonlyOnEdit: true,   // Una estación no puede cambiar de dueño
        gridSpan: 2
      }
    ]
  },
  {
    title: 'Información de la Estación',
    subtitle: 'Datos principales de la sucursal o estación de servicio',
    fields: [
      {
        key: 'name',
        label: 'Nombre Comercial de Estación',
        type: 'text',
        required: true,
        placeholder: 'Ej. Gasolinera OCOZOCOAUTLA',
        gridSpan: 1
      },
      {
        key: 'razon_social',
        label: 'Razón Social (Si difiere)',
        type: 'text',
        required: false,
        placeholder: 'Ej. CONSORCIO OPERATIVO...',
        gridSpan: 1
      },
      {
        key: 'address',
        label: 'Dirección Completa',
        type: 'text',
        required: true,
        placeholder: 'Calle, Número, Colonia...',
        gridSpan: 2
      },
      {
        key: 'cp',
        label: 'Código Postal',
        type: 'text',
        required: false,
        placeholder: 'Ej. 20450',
        gridSpan: 1
      },
      {
        key: 'location',
        label: 'URL de Google Maps',
        type: 'text',
        required: false,
        placeholder: 'https://maps.app.goo.gl/...',
        gridSpan: 1
      }
    ]
  },
  {
    title: 'Ubicación Geográfica',
    fields: [
      {
        key: 'country_id',
        label: 'ID País',
        type: 'hidden',
        hideOnCreate: true,
        hideOnEdit: true
      },
      {
        key: 'state_id',
        label: 'ID Estado',
        type: 'hidden',
        hideOnCreate: true,
        hideOnEdit: true
      },
      {
        key: 'city_id',
        label: '',
        type: 'custom',
        customTypeKey: 'LOCATION_FILTER',
        required: true,
        gridSpan: 2
      }
    ]
  },
  {
    title: 'Configuración Adicional',
    fields: [
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
        label: 'Estatus',
        type: 'boolean',
        required: false,
        placeholder: 'Estación Activa',
        gridSpan: 1
      }
    ]
  }
];
