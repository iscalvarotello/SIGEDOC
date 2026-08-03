import { FormControllerConfig } from '@interfaces/dynamic-form.interface';

export const PERSON_FORM_CONFIG: FormControllerConfig = {
  mainRoute: '/database/rh/persons',
  cacheKeyToInvalidate: 'PERSONS',
  formConfig: [
    {
      title: 'Información Personal',
      subtitle: 'Ingresa los datos personales básicos del registro.',
      fields: [
        {
          key: 'prefix',
          type: 'enum',
          label: 'Prefijo Honorífico',
          placeholder: 'Seleccione un prefijo...',
          options: [
            { label: 'Lic.', value: 'Lic.' },
            { label: 'Ing.', value: 'Ing.' },
            { label: 'Dr.', value: 'Dr.' },
            { label: 'Dra.', value: 'Dra.' },
            { label: 'Arq.', value: 'Arq.' },
            { label: 'Mtro.', value: 'Mtro.' },
            { label: 'Mtra.', value: 'Mtra.' },
            { label: 'C.', value: 'C.' },
            { label: 'C.P.', value: 'C.P.' },
            { label: 'C.P.C.', value: 'C.P.C.' },
            { label: 'M.V.Z.', value: 'M.V.Z.' },
            { label: 'MVZ.', value: 'MVZ.' },
            { label: 'Dr. en C.', value: 'Dr. en C.' }
          ],
          required: true,
          defaultValue: 'Lic.',
          gridSpan: 1
        },
        {
          key: 'name',
          type: 'text',
          label: 'Nombre(s)',
          placeholder: 'Ej. Filiberto',
          required: true,
          gridSpan: 1
        },
        {
          key: 'first_surname',
          type: 'text',
          label: 'Primer Apellido',
          placeholder: 'Ej. Hernández',
          required: true,
          gridSpan: 1
        },
        {
          key: 'second_surname',
          type: 'text',
          label: 'Segundo Apellido',
          placeholder: 'Ej. Pérez (Opcional)',
          required: false,
          gridSpan: 1
        },
        {
          key: 'sex',
          type: 'enum',
          label: 'Sexo',
          placeholder: 'Selecciona el sexo...',
          options: [
            { label: 'Hombre', value: 'H' },
            { label: 'Mujer', value: 'M' }
          ],
          required: false,
          gridSpan: 1
        },
        {
          key: 'birth_date',
          type: 'date',
          label: 'Fecha de Nacimiento',
          placeholder: 'YYYY-MM-DD',
          required: false,
          gridSpan: 1
        }
      ]
    },
    {
      title: 'Identificaciones y Contacto',
      subtitle: 'Ingresa los datos fiscales, identificadores y medios de contacto.',
      fields: [
        {
          key: 'curp',
          type: 'text',
          label: 'CURP',
          placeholder: 'Ej. PEHF890623HCSRZR02 (18 caracteres)',
          required: false,
          gridSpan: 1
        },
        {
          key: 'rfc',
          type: 'text',
          label: 'RFC',
          placeholder: 'Ej. PEHF890623TP1 (12 o 13 caracteres)',
          required: false,
          gridSpan: 1
        },
        {
          key: 'phone',
          type: 'text',
          label: 'Número de Celular',
          placeholder: 'Ej. 961 649 0077',
          required: false,
          gridSpan: 1
        },
        {
          key: 'email',
          type: 'email',
          label: 'Correo Electrónico',
          placeholder: 'Ej. fili.uaa@gmail.com',
          required: false,
          gridSpan: 1
        },
        {
          key: 'nickname',
          type: 'text',
          label: 'Alias o Nickname',
          placeholder: 'Ej. Fili Hernández',
          required: false,
          gridSpan: 2
        }
      ]
    }
  ]
};
