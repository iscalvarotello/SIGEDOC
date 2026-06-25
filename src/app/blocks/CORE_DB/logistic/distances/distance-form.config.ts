import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';
import { TravelScope } from './distance.dto';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';

export const DISTANCE_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/logistic/distances',
  cacheKeyToInvalidate: 'DISTANCES_BY_ORIGIN',
  formConfig: [
    {
      title: 'Ubicaciones',
      subtitle: 'Selecciona la ciudad de origen y la ciudad de destino.',
      fields: [
        {
          key: 'origin_country_id',
          type: 'hidden',
          label: ''
        },
        {
          key: 'origin_state_id',
          type: 'hidden',
          label: ''
        },
        {
          key: 'origin_city_id',
          type: 'custom',
          customTypeKey: 'LOCATION_FILTER',
          customProps: { 
            layout: 'vertical',
            countryKey: 'origin_country_id',
            stateKey: 'origin_state_id'
          },
          label: 'Ciudad de Origen',
          required: true,
          gridSpan: 1
        },
        {
          key: 'destination_country_id',
          type: 'hidden',
          label: ''
        },
        {
          key: 'destination_state_id',
          type: 'hidden',
          label: ''
        },
        {
          key: 'destination_city_id',
          type: 'custom',
          customTypeKey: 'LOCATION_FILTER',
          customProps: { 
            layout: 'vertical',
            countryKey: 'destination_country_id',
            stateKey: 'destination_state_id'
          },
          label: 'Ciudad de Destino',
          required: true,
          gridSpan: 1
        }
      ]
    },
    {
      title: 'Detalles del Trayecto',
      subtitle: 'Especifica la vía, la distancia total y las casetas involucradas.',
      fields: [
        {
          key: 'via',
          type: 'text',
          label: 'Vía o Ruta',
          placeholder: 'Ej. Única, San Cristobal, Villahermosa',
          required: true,
          gridSpan: 1
        },
        {
          key: 'distance_km',
          type: 'number',
          label: 'Distancia (KM)',
          placeholder: 'Ej. 156',
          required: true,
          gridSpan: 1
        },
        {
          key: 'travel_scope',
          type: 'enum',
          label: 'Alcance Geográfico',
          options: [
            { label: 'ESTATAL', value: TravelScope.ESTATAL },
            { label: 'NACIONAL', value: TravelScope.NACIONAL },
            { label: 'INTERNACIONAL', value: TravelScope.INTERNACIONAL }
          ],
          required: true,
          gridSpan: 2
        },
        {
          key: 'toll_booth_ids',
          type: 'api-select',
          label: 'Casetas de Cobro en esta Vía',
          apiConfig: {
            configKey: ENDPOINT_KEYS.TOLL_BOOTHS,
            valueKey: 'id',
            labelKey: 'name',
            multiple: true,
            cache: { enabled: true }
          },
          gridSpan: 2
        }
      ]
    }
  ]
};
