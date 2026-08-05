import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

import { NavItem, MenuSection } from '@metasystem/interfaces/menu.interface';
export type { NavItem, MenuSection };

// ADVERTENCIA: Los números de módulo (module_id) una vez asignados así permanecen para siempre. 
// No se deben reasignar ni modificar, ya que están vinculados a la base de datos de permisos.
export const SIDEBAR_MENU: MenuSection[] = [
  {
    title: 'Operatividad',
    prefix: 'operativity',
    items: [
      {
        name: "Documentos",
        icon: SVG_ICONS.Documentos,
        subItems: [
          { module_id: 17, name: "Memorandums", path: "/operatividad/documento/memo", pro: false, new: false, value: 5 },
          { module_id: 18, name: "Oficios", path: "/operatividad/documento/oficio", pro: false, new: false, value: 2 },
          { module_id: 19, name: "T. Inf.", path: "/operatividad/documento/ti", pro: false, new: false, value: 3 },
          { module_id: 20, name: "Circulares", path: "/operatividad/documento/circular", pro: false, new: false, value: 4 },
          { module_id: 21, name: "Incidencias", path: "/form-elements", pro: false, new: false, value: 4 }],
      },
      {
        name: "Operatividad",
        icon: SVG_ICONS.Maletin,
        subItems: [
          { module_id: 22, name: "Comisiones", path: "/operatividad/comisiones", pro: false },
          { module_id: 23, name: "Bitácoras", path: "/operatividad/bitacoras", pro: false },
          { module_id: 24, name: "C. Asistencias", path: "/operatividad/asistencias", pro: false },
          { module_id: 25, name: "Asignación de Vales", path: "/operatividad/vales", pro: false }],
      },
      {
        name: "Comprobaciones",
        icon: SVG_ICONS.Ticket,
        subItems: [
          { module_id: 26, name: "Viáticos", path: "/comprobaciones/viaticos", pro: false },
          { module_id: 27, name: "Vales de G.", path: "/comprobaciones/vales", pro: false }],
      }
    ]
  },
  {
    title: 'Administración de Datos',
    prefix: 'database',
    items: [
      {
        name: "Geografía",
        icon: SVG_ICONS.Geografia,
        subItems: [
          { module_id: 1, name: "Países", path: "/database/location/countries", pro: false },
          { module_id: 2, name: "Estados", path: "/database/location/states", pro: false },
          { module_id: 3, name: "Ciudades", path: "/database/location/cities", pro: false }],
      },
      {
        name: "Organización",
        icon: SVG_ICONS.Organizacion,
        subItems: [
          { module_id: 40, name: "Instituciones", path: "/database/organization/institutions", pro: false },
          { module_id: 4, name: "Sedes Físicas", path: "/database/organization/branches", pro: false },
          { module_id: 5, name: "Tipos de Área", path: "/database/organization/area-types", pro: false },
          { module_id: 6, name: "Áreas Administrativas", path: "/database/organization/areas", pro: false },
          { module_id: 7, name: "Proveedores", path: "/database/organization/suppliers", pro: false },
          { module_id: 8, name: "Gasolinerías (Sucursales)", path: "/database/organization/fuel-stations", pro: false },
          { module_id: 35, name: "Destinatarios Oficiales", path: "/database/organization/official-recipients", pro: false },
          { module_id: 41, name: "Contactos Externos", path: "/database/organization/external-contacts", pro: false },
          { module_id: 36, name: "Proyectos", path: "/database/organization/projects", pro: false },
          { module_id: 37, name: "Partidas Presupuestales", path: "/database/organization/partidas", pro: false }
        ],
      },
      {
        name: "Logística",
        icon: SVG_ICONS.Camion,
        subItems: [
          { module_id: 9, name: "Casetas de Cobro", path: "/database/logistic/toll-booths", pro: false },
          { module_id: 10, name: "Parque Vehicular", path: "/database/logistic/cars", pro: false },
          { module_id: 11, name: "Tarifas de Viáticos", path: "/database/logistic/tariffs", pro: false },
          { module_id: 12, name: "Rutas y Distancias", path: "/database/logistic/distances", pro: false }],
      },
      {
        name: "Recursos Humanos",
        icon: SVG_ICONS.RH,
        subItems: [
          { module_id: 13, name: "Directorio de Personas", path: "/database/rh/persons", pro: false },
          { module_id: 14, name: "Personal Activo", path: "/database/rh/employees", pro: false },
          { module_id: 15, name: "Catálogo de Puestos", path: "/database/rh/job-positions", pro: false },
          { module_id: 16, name: "Adscripciones", path: "/database/rh/adscriptions", pro: false }],
      }
    ]
  },
  {
    title: 'Sistema',
    prefix: 'system',
    items: [
      {
        name: "Seguridad",
        icon: SVG_ICONS.Escudo,
        subItems: [
          { module_id: 28, name: "Control de usuarios", path: "/system/security/users", pro: false },
          { module_id: 29, name: "Roles", path: "/system/security/roles", pro: false },
          // module_id: 30 fue eliminado (Módulos). No reasignar.
          { module_id: 31, name: "Permisos", path: "/system/security/permissions", pro: false },
          { module_id: 39, name: "Tareas programadas", path: "/system/settings/cron", pro: false }
        ],
      },
      {
        name: "Configuraciones",
        icon: SVG_ICONS.Engrane,
        subItems: [
          { module_id: 32, name: "Generales", path: "/system/settings/generales", pro: false },
          { module_id: 33, name: "Tipos de Documento", path: "/system/security/document-types", pro: false },
          { module_id: 34, name: "Plantillas Oficiales", path: "/system/security/templates", pro: false }
        ],
      }
    ]
  }
];
