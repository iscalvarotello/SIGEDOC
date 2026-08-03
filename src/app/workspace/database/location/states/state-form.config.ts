import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const STATE_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/location/states',
  cacheKeyToInvalidate: 'STATES',
  formConfig: [
    {
      title: 'Datos Generales',
      subtitle: 'Información principal del estado o región',
      fields: [
        { key: 'country_id', label: 'País de Pertenencia', type: 'country-select', required: true, placeholder: 'Seleccione un país...', gridSpan: 2 },
        { key: 'name', label: 'Nombre del Estado', type: 'text', required: true, placeholder: 'Ej. Chiapas, Texas, Madrid...' },
        { key: 'state_code', label: 'Código ISO / Interno', type: 'text', required: false, placeholder: 'Ej. MX-CHP' }
      ]
    },
    {
      title: 'Configuración de Reglas',
      fields: [
        { key: 'zone', label: 'Zona Geográfica', type: 'enum', required: true, defaultValue: 'A', options: [ { label: 'Zona A', value: 'A' }, { label: 'Zona B', value: 'B' }, { label: 'Zona C', value: 'C' } ] },
        { key: 'fix', label: '¿Estado principal?', type: 'boolean', required: false, defaultValue: false, placeholder: 'Estado principal para el sistema'},
        { key: 'index_state', label: 'Ordenamiento Interno', type: 'number', required: false, defaultValue: 0 }
      ]
    } 
  ]
};
