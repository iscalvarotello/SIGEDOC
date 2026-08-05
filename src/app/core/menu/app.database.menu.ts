import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

export const DATABASE_ITEMS = [
  {
    name: "Geografía",
    icon: SVG_ICONS.Geografia,
    subItems: [
      { name: "Países", path: "/database/location/countries", pro: false },
      { name: "Estados", path: "/database/location/states", pro: false },
      { name: "Ciudades", path: "/database/location/cities", pro: false }],
  },
  {
    name: "Organización",
    icon: SVG_ICONS.Organizacion,
    subItems: [
      { name: "Instituciones", path: "/database/organization/institutions", pro: false },
      { name: "Sedes Físicas", path: "/database/organization/branches", pro: false },
      { name: "Tipos de Área", path: "/database/organization/area-types", pro: false },
      { name: "Áreas Administrativas", path: "/database/organization/areas", pro: false },
      { name: "Proveedores", path: "/database/organization/suppliers", pro: false },
      { name: "Gasolinerías (Sucursales)", path: "/database/organization/fuel-stations", pro: false },
      { name: "Destinatarios Oficiales", path: "/database/organization/official-recipients", pro: false },
      { name: "Contactos Externos", path: "/database/organization/external-contacts", pro: false }],
  },
  {
    name: "Logística",
    icon: SVG_ICONS.Camion,
    subItems: [
      { name: "Casetas de Cobro", path: "/database/logistic/toll-booths", pro: false },
      { name: "Parque Vehicular", path: "/database/logistic/cars", pro: false },
      { name: "Tarifas de Viáticos", path: "/database/logistic/tariffs", pro: false },
      { name: "Rutas y Distancias", path: "/database/logistic/distances", pro: false }],
  },
  {
    name: "Recursos Humanos",
    icon: SVG_ICONS.RH,
    subItems: [
      { name: "Directorio de Personas", path: "/database/rh/persons", pro: false },
      { name: "Personal Activo", path: "/database/rh/employees", pro: false },
      { name: "Catálogo de Puestos", path: "/database/rh/job-positions", pro: false },
      { name: "Adscripciones", path: "/database/rh/adscriptions", pro: false }],
  }
];
