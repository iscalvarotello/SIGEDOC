import { DocumentItemList } from '../interfaces/document.interface';



export const LIST_DOCUMENTS: DocumentItemList[] = [
  {
    id_documento: 1,
    tipo_documento: 1, // Memo
    id_solicitante: 100,
    solicitante: 'Tello',
    id_remitente: 100,
    remitente: 'DAYSE',
    id_destinatario: 200,
    destinatario: 'UAA',
    folio: 1, // El pipe en el HTML lo pondrá como 001
    fecha: new Date('2026-03-19'),
    tema: 'Licitacion 001',
    asunto: 'Solicitud de licitacion restringida',
    link_edit: 'https://docs.google.com/.../edit',
    link_acuse: '',
    recibe: '',
    estatus: 'En firma',
    id_estatus: '3',
    medio_envio: '' ,
    id_area_base : 15
  },
  {
    id_documento: 2,
    tipo_documento: 1, // Oficio
    id_solicitante: 102,
    solicitante: 'Iseleng',
    id_remitente: 101, // Firma el Jefe
    remitente: 'DAYSE',
    id_destinatario: 200,
    destinatario: 'UAA',
    folio: 2,
    fecha: new Date('2026-03-20'),
    tema: 'Licitacion 001',
    asunto: 'Contratacion de proveedor',
    link_edit: 'https://docs.google.com/.../edit',
    link_acuse: 'https://docs.google.com/.../view',
    recibe: 'Bonita',
    estatus: 'Entregado',
    id_estatus: '4',
    medio_envio: 'directo' ,
    id_area_base : 15
  },
  {
    id_documento: 3,
    tipo_documento: 1, // Memo
    id_solicitante: 100,
    solicitante: 'Tello',
    id_remitente: 101,
    remitente: 'DAYSE',
    id_destinatario: 201,
    destinatario: 'UAJ', // Aquí aplicamos lo que dijiste de circular
    folio: 3,
    fecha: new Date('2026-03-21'),
    tema: 'Licitacion',
    asunto: 'Solicitud de validación de contrato',
    link_edit: 'https://docs.google.com/.../edit',
    link_acuse: '',
    recibe: '',
    estatus: 'En edición',
    id_estatus: '1',
    medio_envio: '' ,
    id_area_base : 15
  }
];