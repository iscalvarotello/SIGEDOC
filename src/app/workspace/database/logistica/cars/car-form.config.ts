import { FormControllerConfig } from '@interfaces/dynamic-form.interface';
import { CategoryCar } from './car.dto';

export const CAR_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/logistic/cars',
  cacheKeyToInvalidate: 'CARS',
  formConfig: [
    {
      title: 'Información del Vehículo',
      subtitle: 'Datos generales y especificaciones técnicas.',
      fields: [
        {
          key: 'name',
          type: 'text',
          label: 'Nombre del Vehículo',
          placeholder: 'Ej. Toyota Avanza 3',
          required: true
        },
        {
          key: 'marca',
          type: 'text',
          label: 'Marca',
          placeholder: 'Ej. Toyota',
          required: true
        },
        {
          key: 'modelo',
          type: 'text',
          label: 'Modelo',
          placeholder: 'Ej. 2019',
          required: true
        },
        {
          key: 'tipo',
          type: 'text',
          label: 'Tipo',
          placeholder: 'Ej. Avanza',
          required: true
        },
        {
          key: 'placas',
          type: 'text',
          label: 'Placas',
          placeholder: 'Ej. DEG-AAA-HW9',
          required: true
        },
        {
          key: 'rendimiento',
          type: 'number',
          label: 'Rendimiento (km/l)',
          placeholder: 'Ej. 7',
          required: true
        },
        {
          key: 'category',
          type: 'enum',
          label: 'Categoría',
          options: [
            { label: 'MOTO (Motocicletas)', value: CategoryCar.MOTO },
            { label: 'CAR_PICKUP (Carros o camionetas pick up)', value: CategoryCar.CAR_PICKUP },
            { label: 'BUS (Autobuses de 2 o 4 Ejes)', value: CategoryCar.BUS },
            { label: 'TRUCK_4X (Camiones pesados de 2 a 4 ejes)', value: CategoryCar.TRUCK_4X },
            { label: 'TRUCK_6X (Camiones pesados de 5 a 6 ejes)', value: CategoryCar.TRUCK_6X },
            { label: 'TRUCK_9X (Camiones pesados de 7 a 9 ejes)', value: CategoryCar.TRUCK_9X }
          ],
          required: true
        },
        {
          key: 'index_sort',
          type: 'number',
          label: 'Orden de Visualización',
          placeholder: 'Ej. 1'
        }
      ]
    }
  ]
};
