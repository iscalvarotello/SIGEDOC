import { SVG_ICONS } from '../../../shared/icons/svg-icons';

export const SYSTEM_ITEMS = [
  {
    name: "Seguridad",
    icon: SVG_ICONS.Escudo,
    subItems: [
      { name: "Control de usuarios", path: "/database/security/users", pro: false },
      { name: "Roles", path: "/database/security/roles", pro: false },
      { name: "Módulos", path: "/database/security/modules", pro: false },
      { name: "Permisos", path: "/database/security/permissions", pro: false }
    ],
  },
  {
    name: "Configuraciones",
    icon: SVG_ICONS.Engrane,
    subItems: [
      { name: "Generales", path: "/database/security/generales", pro: false },
      { name: "Tipos de Documento", path: "/database/security/document-types", pro: false },
      { name: "Plantillas", path: "/database/security/templates", pro: false },
      { name: "Plantillas Internas", path: "/database/security/internal-templates", pro: false }
    ],
  }
];
