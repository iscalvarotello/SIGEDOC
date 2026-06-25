import { Routes } from '@angular/router';

export const CORE_DB_ROUTES: Routes = [
  {
    path: 'location/countries',
    loadComponent: () => import('./location/countries/countries-page.component').then(m => m.CountriesPageComponent),
    title: 'Geografía - Países'
  },
  {
    path: 'location/countries/new',
    loadComponent: () => import('./location/countries/country-form/country-form.component').then(m => m.CountryFormComponent),
    title: 'Nuevo País'
  },
  {
    path: 'location/countries/:id',
    loadComponent: () => import('./location/countries/country-form/country-form.component').then(m => m.CountryFormComponent),
    title: 'Editar País'
  },
  // -- Áreas
  {
    path: 'organization/areas',
    loadComponent: () => import('./organization/areas/areas-page.component').then(m => m.AreasPageComponent),
    data: { title: 'Áreas' }
  },
  {
    path: 'organization/areas/new',
    loadComponent: () => import('./organization/areas/area-form.component').then(m => m.AreaFormComponent),
    data: { title: 'Nueva Área' }
  },
  {
    path: 'organization/areas/:id',
    loadComponent: () => import('./organization/areas/area-form.component').then(m => m.AreaFormComponent),
    data: { title: 'Editar Área' }
  },
  
  // -- Tipos de Área
  {
    path: 'organization/area-types',
    loadComponent: () => import('./organization/area-types/area-types-page.component').then(m => m.AreaTypesPageComponent),
    data: { title: 'Tipos de Área' }
  },
  {
    path: 'organization/area-types/new',
    loadComponent: () => import('./organization/area-types/area-type-form.component').then(m => m.AreaTypeFormComponent),
    data: { title: 'Nuevo Tipo de Área' }
  },
  {
    path: 'organization/area-types/:id',
    loadComponent: () => import('./organization/area-types/area-type-form.component').then(m => m.AreaTypeFormComponent),
    data: { title: 'Editar Tipo de Área' }
  },
  
  // -- Sedes Físicas
  {
    path: 'organization/branches',
    loadComponent: () => import('./organization/branches/branches-page.component').then(m => m.BranchesPageComponent),
    data: { title: 'Sedes Físicas' }
  },
  {
    path: 'organization/branches/new',
    loadComponent: () => import('./organization/branches/branch-form.component').then(m => m.BranchFormComponent),
    data: { title: 'Nueva Sede' }
  },
  {
    path: 'organization/branches/:id',
    loadComponent: () => import('./organization/branches/branch-form.component').then(m => m.BranchFormComponent),
    data: { title: 'Editar Sede Física' }
  },
  
  // ============================================
  // ORGANIZACIÓN: DESTINATARIOS OFICIALES
  // ============================================
  {
    path: 'organization/official-recipients',
    loadComponent: () => import('./organization/official-recipients/official-recipients-page.component').then(m => m.OfficialRecipientsPageComponent),
    data: { title: 'Destinatarios Oficiales' }
  },
  {
    path: 'organization/official-recipients/new',
    loadComponent: () => import('./organization/official-recipients/official-recipient-form.component').then(m => m.OfficialRecipientFormComponent),
    data: { title: 'Nuevo Destinatario Oficial' }
  },
  {
    path: 'organization/official-recipients/:id',
    loadComponent: () => import('./organization/official-recipients/official-recipient-form.component').then(m => m.OfficialRecipientFormComponent),
    data: { title: 'Editar Destinatario Oficial' }
  },

  // ============================================
  // ORGANIZACIÓN: PROVEEDORES (SUPPLIERS)
  // ============================================
  {
    path: 'organization/suppliers',
    loadComponent: () => import('./organization/suppliers/suppliers-page.component').then(m => m.SuppliersPageComponent),
    data: { title: 'Directorio de Proveedores' }
  },
  {
    path: 'organization/suppliers/new',
    loadComponent: () => import('./organization/suppliers/supplier-form.component').then(m => m.SupplierFormComponent),
    data: { title: 'Nuevo Proveedor' }
  },
  {
    path: 'organization/suppliers/:id',
    loadComponent: () => import('./organization/suppliers/supplier-form.component').then(m => m.SupplierFormComponent),
    data: { title: 'Editar Proveedor' }
  },

  // ============================================
  // ORGANIZACIÓN: PROYECTOS (PROJECTS)
  // ============================================
  {
    path: 'organization/projects',
    loadComponent: () => import('./organization/projects/projects-page.component').then(m => m.ProjectsPageComponent),
    data: { title: 'Catálogo de Proyectos' }
  },
  {
    path: 'organization/projects/new',
    loadComponent: () => import('./organization/projects/project-form.component').then(m => m.ProjectFormComponent),
    data: { title: 'Nuevo Proyecto' }
  },
  {
    path: 'organization/projects/:id',
    loadComponent: () => import('./organization/projects/project-form.component').then(m => m.ProjectFormComponent),
    data: { title: 'Editar Proyecto' }
  },

  // ============================================
  // ORGANIZACIÓN: PARTIDAS (PARTIDAS)
  // ============================================
  {
    path: 'organization/partidas',
    loadComponent: () => import('./organization/partidas/partidas-page.component').then(m => m.PartidasPageComponent),
    data: { title: 'Catálogo de Partidas' }
  },
  {
    path: 'organization/partidas/new',
    loadComponent: () => import('./organization/partidas/partida-form.component').then(m => m.PartidaFormComponent),
    data: { title: 'Nueva Partida' }
  },
  {
    path: 'organization/partidas/:id',
    loadComponent: () => import('./organization/partidas/partida-form.component').then(m => m.PartidaFormComponent),
    data: { title: 'Editar Partida' }
  },

  // ============================================
  // ORGANIZACIÓN: GASOLINERÍAS (FUEL STATIONS)
  // ============================================
  {
    path: 'organization/fuel-stations',
    loadComponent: () => import('./organization/fuel-stations/fuel-stations-page.component').then(m => m.FuelStationsPageComponent),
    data: { title: 'Catálogo de Gasolinerías' }
  },
  {
    path: 'organization/fuel-stations/new',
    loadComponent: () => import('./organization/fuel-stations/fuel-station-form.component').then(m => m.FuelStationFormComponent),
    data: { title: 'Nueva Gasolinería' }
  },
  {
    path: 'organization/fuel-stations/:id',
    loadComponent: () => import('./organization/fuel-stations/fuel-station-form.component').then(m => m.FuelStationFormComponent),
    data: { title: 'Editar Gasolinería' }
  },
  {
    path: 'location/states',
    loadComponent: () => import('./location/states/states-page.component').then(m => m.StatesPageComponent),
    title: 'Geografía - Estados y Regiones'
  },
  {
    path: 'location/states/new',
    loadComponent: () => import('./location/states/states-form.component').then(m => m.StatesFormComponent),
    title: 'Nuevo Estado'
  },
  {
    path: 'location/states/:id',
    loadComponent: () => import('./location/states/states-form.component').then(m => m.StatesFormComponent),
    title: 'Editar Estado'
  },
  {
    path: 'location/cities',
    loadComponent: () => import('./location/cities/cities-page.component').then(m => m.CitiesPageComponent),
    title: 'Geografía - Ciudades'
  },
  {
    path: 'location/cities/new',
    loadComponent: () => import('./location/cities/cities-form.component').then(m => m.CitiesFormComponent),
    title: 'Nueva Ciudad'
  },
  {
    path: 'location/cities/:id',
    loadComponent: () => import('./location/cities/cities-form.component').then(m => m.CitiesFormComponent),
    title: 'Editar Ciudad'
  },
  // ============================================
  // LOGÍSTICA: CASETAS DE COBRO (TOLL BOOTHS)
  // ============================================
  {
    path: 'logistic/toll-booths',
    loadComponent: () => import('./logistic/toll-booths/toll-booths-page.component').then(m => m.TollBoothsPageComponent),
    title: 'Casetas de Cobro'
  },
  {
    path: 'logistic/toll-booths/new',
    loadComponent: () => import('./logistic/toll-booths/toll-booth-form.component').then(m => m.TollBoothFormComponent),
    title: 'Nueva Caseta de Cobro'
  },
  {
    path: 'logistic/toll-booths/:id',
    loadComponent: () => import('./logistic/toll-booths/toll-booth-form.component').then(m => m.TollBoothFormComponent),
    title: 'Editar Caseta de Cobro'
  },
  {
    path: 'logistic/tariffs',
    loadComponent: () => import('./logistic/tariffs/tariffs-page.component').then(m => m.TariffsPageComponent),
    title: 'Tarifas'
  },
  {
    path: 'logistic/tariffs/new',
    loadComponent: () => import('./logistic/tariffs/tariff-form.component').then(m => m.TariffFormComponent),
    title: 'Nueva Tarifa'
  },
  {
    path: 'logistic/tariffs/:id',
    loadComponent: () => import('./logistic/tariffs/tariff-form.component').then(m => m.TariffFormComponent),
    title: 'Editar Tarifa'
  },
  // ============================================
  // LOGÍSTICA: PARQUE VEHICULAR (CARS)
  // ============================================
  {
    path: 'logistic/cars',
    loadComponent: () => import('./logistic/cars/cars-page.component').then(m => m.CarsPageComponent),
    title: 'Parque Vehicular'
  },
  {
    path: 'logistic/cars/new',
    loadComponent: () => import('./logistic/cars/car-form.component').then(m => m.CarFormComponent),
    title: 'Nuevo Vehículo'
  },
  {
    path: 'logistic/cars/:id',
    loadComponent: () => import('./logistic/cars/car-form.component').then(m => m.CarFormComponent),
    title: 'Editar Vehículo'
  },
  // ============================================
  // LOGÍSTICA: DISTANCIAS Y CASETAS
  // ============================================
  {
    path: 'logistic/distances',
    loadComponent: () => import('./logistic/distances/distances-page.component').then(m => m.DistancesPageComponent),
    title: 'Distancias y Casetas'
  },
  {
    path: 'logistic/distances/new',
    loadComponent: () => import('./logistic/distances/distance-form.component').then(m => m.DistanceFormComponent),
    title: 'Nueva Distancia'
  },
  {
    path: 'logistic/distances/:id',
    loadComponent: () => import('./logistic/distances/distance-form.component').then(m => m.DistanceFormComponent),
    title: 'Editar Distancia'
  },
  // ============================================
  // RECURSOS HUMANOS: DIRECTORIO DE PERSONAS
  // ============================================
  {
    path: 'rh/persons',
    loadComponent: () => import('./rh/persons/persons-page.component').then(m => m.PersonsPageComponent),
    title: 'Directorio de Personas'
  },
  {
    path: 'rh/persons/new',
    loadComponent: () => import('./rh/persons/person-form.component').then(m => m.PersonFormComponent),
    title: 'Registrar Persona'
  },
  {
    path: 'rh/persons/:id',
    loadComponent: () => import('./rh/persons/person-form.component').then(m => m.PersonFormComponent),
    title: 'Editar Persona'
  },
  // ============================================
  // RECURSOS HUMANOS: CATÁLOGO DE PUESTOS
  // ============================================
  {
    path: 'rh/job-positions',
    loadComponent: () => import('./rh/job-positions/job-positions-page.component').then(m => m.JobPositionsPageComponent),
    title: 'Catálogo de Puestos'
  },
  {
    path: 'rh/job-positions/new',
    loadComponent: () => import('./rh/job-positions/job-position-form.component').then(m => m.JobPositionFormComponent),
    title: 'Registrar Puesto'
  },
  {
    path: 'rh/job-positions/:id',
    loadComponent: () => import('./rh/job-positions/job-position-form.component').then(m => m.JobPositionFormComponent),
    title: 'Editar Puesto'
  },
  // ============================================
  // RECURSOS HUMANOS: ADSCRIPCIONES
  // ============================================
  {
    path: 'rh/adscriptions',
    loadComponent: () => import('./rh/adscriptions/adscriptions-tree-page.component').then(m => m.AdscriptionsTreePageComponent),
    title: 'Organización - Adscripciones por Área'
  },
  // ============================================
  // RECURSOS HUMANOS: PERSONAL ACTIVO (EMPLEADOS)
  // ============================================
  {
    path: 'rh/employees',
    loadComponent: () => import('./rh/employees/employees-page.component').then(m => m.EmployeesPageComponent),
    title: 'Recursos Humanos - Personal Activo'
  },
  // ============================================
  // SEGURIDAD: CONTROL DE USUARIOS
  // ============================================
  {
    path: 'security/users',
    loadComponent: () => import('./security/users/usuarios-page.component').then(m => m.UsuariosPageComponent),
    title: 'Seguridad - Control de Usuarios'
  },
  {
    path: 'security/users/new',
    loadComponent: () => import('./security/users/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    title: 'Nuevo Usuario'
  },
  {
    path: 'security/users/:id',
    loadComponent: () => import('./security/users/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    title: 'Editar Usuario'
  },
  // ============================================
  // SEGURIDAD: ROLES
  // ============================================
  {
    path: 'security/roles',
    loadComponent: () => import('./security/roles/roles-page.component').then(m => m.RolesPageComponent),
    title: 'Seguridad - Roles'
  },
  {
    path: 'security/roles/new',
    loadComponent: () => import('./security/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
    title: 'Nuevo Rol'
  },
  {
    path: 'security/roles/:id',
    loadComponent: () => import('./security/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
    title: 'Editar Rol'
  },
  // ============================================
  // SEGURIDAD: PERMISOS
  // ============================================
  {
    path: 'security/permissions',
    loadComponent: () => import('./security/permissions/permissions-page.component').then(m => m.PermissionsPageComponent),
    title: 'Seguridad - Permisos por Rol'
  },
  // ============================================
  // SEGURIDAD: CONFIGURACIONES GENERALES
  // ============================================
  {
    path: 'security/generales',
    loadComponent: () => import('./security/generales/generales-page.component').then(m => m.GeneralesPageComponent),
    title: 'Configuraciones Generales'
  },
  {
    path: 'security/document-types',
    loadComponent: () => import('./security/document-types/document-type-catalog-page.component').then(m => m.DocumentTypeCatalogPageComponent),
    title: 'Tipos de Documento'
  },
  {
    path: 'security/document-types/new',
    loadComponent: () => import('./security/document-types/document-type-catalog-form/document-type-catalog-form.component').then(m => m.DocumentTypeCatalogFormComponent),
    title: 'Nuevo Tipo de Documento'
  },
  {
    path: 'security/document-types/:id',
    loadComponent: () => import('./security/document-types/document-type-catalog-form/document-type-catalog-form.component').then(m => m.DocumentTypeCatalogFormComponent),
    title: 'Editar Tipo de Documento'
  },
  {
    path: 'security/templates',
    loadComponent: () => import('./security/templates/document-template-page.component').then(m => m.DocumentTemplatesPageComponent),
    title: 'Plantillas'
  },
  {
    path: 'security/templates/new',
    loadComponent: () => import('./security/templates/document-template-form/document-template-form.component').then(m => m.DocumentTemplateFormComponent),
    title: 'Nueva Plantilla'
  },
  {
    path: 'security/templates/:id',
    loadComponent: () => import('./security/templates/document-template-form/document-template-form.component').then(m => m.DocumentTemplateFormComponent),
    title: 'Editar Plantilla'
  },
  {
    path: 'security/internal-templates',
    loadComponent: () => import('./security/internal-templates/internal-templates-page.component').then(m => m.InternalTemplatesPageComponent),
    title: 'Plantillas Internas'
  },
  {
    path: 'security/internal-templates/new',
    loadComponent: () => import('./security/internal-templates/internal-template-form.component').then(m => m.InternalTemplateFormComponent),
    title: 'Nueva Plantilla Interna'
  },
  {
    path: 'security/internal-templates/:id',
    loadComponent: () => import('./security/internal-templates/internal-template-form.component').then(m => m.InternalTemplateFormComponent),
    title: 'Editar Plantilla Interna'
  }
];

