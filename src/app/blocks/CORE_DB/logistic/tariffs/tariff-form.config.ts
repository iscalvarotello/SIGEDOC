import { FormControllerConfig } from '@app/shared/interfaces/dynamic-form.interface';
import { EmployeeCategory, TravelScope, Currency } from './tariff.dto';

export const TARIFF_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/logistic/tariffs',
  cacheKeyToInvalidate: 'TARIFFS',
  formConfig: [
    {
      title: 'Datos Principales',
      subtitle: 'Configuración general de la tarifa',
      fields: [
        { 
          key: 'employ_category', 
          label: 'Categoría de Empleado', 
          type: 'enum', 
          required: true,
          readonlyOnEdit: true,
          gridSpan: 1,
          options: [
            { value: EmployeeCategory.A, label: 'Categoría A' },
            { value: EmployeeCategory.B, label: 'Categoría B' },
            { value: EmployeeCategory.C, label: 'Categoría C' },
            { value: EmployeeCategory.D, label: 'Categoría D' },
            { value: EmployeeCategory.E, label: 'Categoría E' },
            { value: EmployeeCategory.F, label: 'Categoría F' }
          ]
        },
        { 
          key: 'travel_scope', 
          label: 'Alcance Geográfico', 
          type: 'enum', 
          required: true, 
          readonlyOnEdit: true,
          gridSpan: 1,
          options: [
            { value: TravelScope.STATE, label: 'Estatal' },
            { value: TravelScope.NATIONAL, label: 'Nacional' },
            { value: TravelScope.INTERNATIONAL, label: 'Internacional' }
          ]
        },
        { 
          key: 'year', 
          label: 'Año de Vigencia', 
          type: 'number', 
          required: true, 
          readonlyOnEdit: true,
          gridSpan: 1 
        },
        { 
          key: 'currency', 
          label: 'Moneda', 
          type: 'enum', 
          required: true, 
          gridSpan: 1,
          options: [
            { value: Currency.MXN, label: 'MXN - Pesos' },
            { value: Currency.USD, label: 'USD - Dólares' }
          ]
        }
      ]
    },
    {
      title: 'Zona A',
      subtitle: 'Tarifas para la Zona Económica A',
      fields: [
        { key: 'zone_A_full_day', label: 'Día Completo (A)', type: 'number', required: true, gridSpan: 1 },
        { key: 'zone_A_middle_day', label: 'Medio Día (A)', type: 'number', required: true, gridSpan: 1 }
      ]
    },
    {
      title: 'Zona B',
      subtitle: 'Tarifas para la Zona Económica B',
      fields: [
        { key: 'zone_B_full_day', label: 'Día Completo (B)', type: 'number', required: true, gridSpan: 1 },
        { key: 'zone_B_middle_day', label: 'Medio Día (B)', type: 'number', required: true, gridSpan: 1 }
      ]
    },
    {
      title: 'Zona C',
      subtitle: 'Tarifas para la Zona Económica C',
      fields: [
        { key: 'zone_C_full_day', label: 'Día Completo (C)', type: 'number', required: true, gridSpan: 1 },
        { key: 'zone_C_middle_day', label: 'Medio Día (C)', type: 'number', required: true, gridSpan: 1 }
      ]
    }
  ]
};
