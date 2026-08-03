import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

export const SYSTEM_ITEMS = [
  {
    name: "Seguridad",
    icon: SVG_ICONS.Escudo,
    subItems: [
      { name: "Control de usuarios", path: "/system/security/users", pro: false },
      { name: "Roles", path: "/system/security/roles", pro: false },
      { name: "Módulos", path: "/system/security/modules", pro: false },
      { name: "Permisos", path: "/system/security/permissions", pro: false },
      { name: "Tareas programadas", path: "/system/settings/cron", pro: false }
    ],
  },
  {
    name: "Configuraciones",
    icon: SVG_ICONS.Engrane,
    subItems: [
      { name: "Generales", path: "/system/settings/generales", pro: false },
      { name: "Manuales del Sistema", path: "/system/settings/manuals", pro: false },
      { name: "Tipos de Documento", path: "/system/security/document-types", pro: false },
      { name: "Plantillas", path: "/system/security/templates", pro: false }
    ],
  }
];
