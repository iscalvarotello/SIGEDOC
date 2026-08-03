import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

export const OPERATIVITY_ITEMS = [
  {
    name: "Documentos",
    icon: SVG_ICONS.Documentos,
    subItems: [
      { name: "Memorandums", path: "/operatividad/documento/memo", pro: false, new: false, value: 5 },
      { name: "Oficios", path: "/operatividad/documento/oficio", pro: false, new: false, value: 2 },
      { name: "T. Inf.", path: "/operatividad/documento/ti", pro: false, new: false, value: 3 },
      { name: "Circulares", path: "/operatividad/documento/circular", pro: false, new: false, value: 4 },
      { name: "Incidencias", path: "/form-elements", pro: false, new: false, value: 4 }],
  },
  {
    name: "Operatividad",
    icon: SVG_ICONS.Maletin,
    subItems: [
      { name: "Comisiones", path: "/operatividad/comisiones", pro: false },
      { name: "Bitácoras", path: "/operatividad/bitacoras", pro: false },
      { name: "C. Asistencias", path: "/operatividad/asistencias", pro: false },
      { name: "Asignación de Vales", path: "/operatividad/vales", pro: false }],
  },
  {
    name: "Comprobaciones",
    icon: SVG_ICONS.Ticket,
    subItems: [
      { name: "Viáticos", path: "/comprobaciones/viaticos", pro: false },
      { name: "Vales de G.", path: "/comprobaciones/vales", pro: false }],
  }
];
