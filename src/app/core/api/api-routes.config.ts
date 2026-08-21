import { ApiPackageConfig } from './api.interfaces';

export const BranchFrontendMapping: Record<string, string[]> = {
  city_id: ['city_id', 'city.id'],
  state_id: ['state_id', 'state.id', 'city.state.id'],
  country_id: ['country_id', 'country.id', 'city.state.country.id']
};

export const InstitutionFrontendMapping: Record<string, string[]> = {
  main_branch_id: ['main_branch_id', 'main_branch.id']
};

export const ENDPOINT_KEYS = {
  AREAS: 'areas',
  DOCUMENTS: 'documents',
  AUTH: 'auth',
  COUNTRIES: 'countries',
  STATES: 'states',
  CITIES: 'cities',
  BRANCHES: 'branches',
  AREA_TYPES: 'area_types',
  SUPPLIERS: 'suppliers',
  FUEL_STATIONS: 'fuel_stations',
  EXTERNAL_CONTACTS: 'external_contacts',
  TOLL_BOOTHS: 'toll_booths',
  TARIFFS: 'tariffs',
  CARS: 'cars',
  DISTANCES: 'distances',
  PERSONS: 'persons',
  JOB_POSITIONS: 'job_positions',
  EMPLOYEES: 'employees',
  ADSCRIPTIONS: 'adscriptions',
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permisos',
  SYSTEM: 'system',
  SIGNATURES: 'signatures',
  SEED: 'seed',
  DOCUMENT_TYPE_CATALOGS: 'document_type_catalogs',
  DOCUMENT_TEMPLATES: 'document_templates',
  OFFICIAL_RECIPIENTS: 'official_recipients',
  PROJECTS: 'projects',
  PARTIDAS: 'partidas',
  INTERNAL_TEMPLATES: 'internal_templates',
  ATTACHMENTS: 'attachments',
  NOTIFICATIONS: 'notifications',
  CRON_JOBS: 'cron_jobs',
  INSTITUTIONS: 'institutions',
  SUPER_SEED: 'super-seed',
  HTML_TEMPLATES: 'html_templates'
};

export const ApiRouteConfig: Record<string, ApiPackageConfig> = {
  [ENDPOINT_KEYS.OFFICIAL_RECIPIENTS]: {
                                          base: '/organization/official-recipients',
                                          plain: true
                                       },
  [ENDPOINT_KEYS.AUTH]              : {
                                          base: '/auth',
                                          specialRoutes: {
                                                            login: { path: '/auth/login', method: 'POST' }
                                                         }
                                      },
  [ENDPOINT_KEYS.AREAS]             : {
                                          base  : '/organization/areas',
                                          plain : true,
                                          specialRoutes: {
                                              getTree      : { path: '/organization/areas/:id/tree', method: 'GET' },
                                              updateStatus : { path: '/organization/areas/:id/status', method: 'PATCH' },
                                              customFields : { path: '/organization/areas/custom_document_fields', method: 'PATCH' },
                                              getTemas     : { path: '/organization/areas/:id/temas', method: 'GET', raw: true },
                                              addTema      : { path: '/organization/areas/:id/temas', method: 'PATCH' }
                                     }
  },
  [ENDPOINT_KEYS.DOCUMENTS]        : {
                                         base: '/documents/documentos',
                                         specialRoutes: {
                                              inbox             : { path: '/documents/documentos/inbox'                  , method: 'GET'                       } ,
                                              action            : { path: '/documents/documentos/:id/action'             , method: 'PATCH'                     } ,
                                              download          : { path: '/documents/documentos/:id/pdf'                , method: 'GET', responseType: 'blob' } ,
                                              downloadMerged    : { path: '/documents/documentos/:id/pdf-merged'         , method: 'GET', responseType: 'blob' } ,
                                              renderEmergencyHtml: { path: '/documents/documentos/:id/render-html'       , method: 'GET', responseType: 'blob' } ,
                                              regeneratePdf     : { path: '/documents/documentos/:id/regenerate-pdf'     , method: 'POST'                      } ,
                                              rechazar          : { path: '/documents/documentos/:id/rechazar'           , method: 'POST'                      } ,
                                              reply             : { path: '/documents/documentos/:id/reply'              , method: 'POST'                      } ,
                                              followUp          : { path: '/documents/documentos/:id/follow-up'          , method: 'POST'                      } ,
                                              draftAction       : { path: '/documents/documentos/:id/draft-action'       , method: 'GET'                       } ,
                                              testPdf           : { path: '/documents/documentos/:id/view_pdf_temp'      , method: 'POST'                      } ,
                                              addCcp            : { path: '/documents/documentos/:id/add-ccp'            , method: 'POST'                      } ,
                                              details           : { path: '/documents/documentos/:id/details'            , method: 'PATCH'                     } ,
                                              possibleReviewers : { path: '/documents/documentos/:id/possible-reviewers' , method: 'GET'  , raw: true          } ,
                                              comments          : { path: '/documents/documentos/:id/comments'           , method: 'PATCH'                     } ,
                                              updateAttachments : { path: '/documents/documentos/:id/anexos'             , method: 'POST'                      } ,
                                              getAttachments    : { path: '/documents/documentos/:id/anexos'             , method: 'GET'                       } ,
                                              uploadAcuse       : { path: '/documents/documentos/:id/acuse'              , method: 'POST'                      } ,
                                              uploadWordDraft   : { path: '/documents/documentos/:id/word-draft'         , method: 'POST'                      } ,
                                              consolidate       : { path: '/documents/documentos/:id/consolidar'         , method: 'POST'                      },
                                              syncTextFromDrive : { path: '/documents/documentos/:id/sync-text'          , method: 'GET'                       }
                                        }
                                      },
  [ENDPOINT_KEYS.COUNTRIES]         : {
                                         base: '/location/countries'
                                    },
  [ENDPOINT_KEYS.STATES]            : {
                                         base: '/location/states',
                                         plain: true,
                                         specialRoutes: {
                                           byCountry: { path: '/location/countries/:countryId/states', method: 'GET', plain: true }
                                         }
                                      },
  [ENDPOINT_KEYS.CITIES]            : {
                                        base: '/location/cities',
                                        plain: true,
                                        specialRoutes: {
                                          byState: { path: '/location/states/:stateId/cities', method: 'GET', plain: true }
                                        }
                                      },
  [ENDPOINT_KEYS.BRANCHES]         : {
    base: '/organization/branches',
    plain: true,
    frontendMapping: BranchFrontendMapping
  },
  [ENDPOINT_KEYS.AREA_TYPES]: {
    base: '/organization/area-types',
    plain: true
  },
  [ENDPOINT_KEYS.SUPPLIERS]: {
    base: '/organization/suppliers',
    plain: true,
    specialRoutes: {
      updateAttachments: { path: '/organization/suppliers/:id/anexos', method: 'POST' }
    }
  },
  [ENDPOINT_KEYS.FUEL_STATIONS]: {
    base: '/organization/fuel-stations',
    plain: true,
    specialRoutes: {
      byProvider: { path: '/organization/fuel-stations/provider/:id', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.EXTERNAL_CONTACTS]: {
    base: '/organization/external-contacts',
    plain: true
  },
  [ENDPOINT_KEYS.TOLL_BOOTHS]: {
    base: '/logistic/toll-booths',
    plain: true
  },
  [ENDPOINT_KEYS.TARIFFS]: {
    base: '/logistic/tariffs',
    plain: true,
    specialRoutes: {
      getMatrix: { path: '/logistic/tariffs/matrix/:year', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.CARS]: {
    base: '/logistic/cars',
    plain: true
  },
  [ENDPOINT_KEYS.DISTANCES]: {
    base: '/logistic/distances',
    plain: true,
    specialRoutes: {
      getByOrigin: { path: '/logistic/distances/origin/:originCityId', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.PERSONS]: {
    base: '/rh/persons',
    specialRoutes: {
      unemployed: { path: '/rh/persons/unemployeed', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.JOB_POSITIONS]: {
    base: '/rh/job-positions'
  },
  [ENDPOINT_KEYS.EMPLOYEES]: {
    base: '/rh/employees',
    plain: true,
    specialRoutes: {
      byArea: { path: '/rh/employees/area/:idArea', method: 'GET', plain: true },
      dismiss: { path: '/rh/employees/:id/dismiss', method: 'POST' },
      deadlist: { path: '/rh/employees/deadlist', method: 'GET', plain: true },
      subirFirma: { path: '/rh/employees/:id/firma', method: 'POST' },
      asignarVobo: { path: '/rh/employees/:id/vobo', method: 'PATCH' }
    }
  },
  [ENDPOINT_KEYS.ADSCRIPTIONS]: {
    base: '/rh/adscriptions',
    plain: true,
    specialRoutes: {
      byArea: { path: '/rh/adscriptions/:idArea/employees', method: 'GET', plain: true },
      transfer: { path: '/rh/adscriptions/:id/transfer', method: 'POST' },
      dismiss: { path: '/rh/adscriptions/:id/dismiss', method: 'POST' },
      restore_titular: { path: '/rh/adscriptions/:id/restore_titular', method: 'POST' },
      receptionists: { path: '/rh/adscriptions/receptionists/:area_id', method: 'GET', plain: true },
      reviewers: { path: '/rh/adscriptions/reviewers/:idArea', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.USERS]: {
    base: '/users/usuarios',
    plain: true,
    specialRoutes: {
      changePassword: { path: '/users/usuarios/:id/change-password', method: 'PATCH' },
      uploadProfilePhoto: { path: '/users/usuarios/profilephoto', method: 'POST' },
      getProfilePhoto: { path: '/users/usuarios/profilephoto/:id', method: 'GET', plain: true },
      resetPassword: { path: '/users/usuarios/reset_password/:idUser', method: 'PATCH' }
    }
  },
  [ENDPOINT_KEYS.NOTIFICATIONS]: {
    base: '/notifications/notificaciones',
    specialRoutes: {
      markAsRead: { path: '/notifications/notificaciones/:id/read', method: 'PATCH' },
      dismiss: { path: '/notifications/notificaciones/:id/dismiss', method: 'PATCH' }
    }
  },
  [ENDPOINT_KEYS.ROLES]: {
    base: '/users/roles',
    plain: true
  },
  [ENDPOINT_KEYS.PERMISSIONS]: {
    base: '/users/permisos',
    plain: true
  },
  [ENDPOINT_KEYS.SYSTEM]: {
    base: '/system',
    specialRoutes: {
      uploadBackground: { path: '/system/background', method: 'POST' },
      getBackground: { path: '/system/background', method: 'GET' },
      globalMinutarios: { path: '/system/global-minutarios', method: 'GET', plain: true },
      areasMinutarios: { path: '/system/areas-minutarios', method: 'GET', plain: true },
      newYear: { path: '/system/new-year/:year', method: 'POST' }
    }
  },
  [ENDPOINT_KEYS.SIGNATURES]: {
    base: '/signatures',
    specialRoutes: {
      getSettings: { path: '/signatures/settings', method: 'GET' },
      updateSettings: { path: '/signatures/settings', method: 'PATCH' },
      registerCertificate: { path: '/signatures/certificate', method: 'POST' }
    }
  },
  [ENDPOINT_KEYS.SEED]: {
    base: '/seed',
    specialRoutes: {
      system: { path: '/seed/system', method: 'GET' }
    }
  },
  [ENDPOINT_KEYS.DOCUMENT_TYPE_CATALOGS]: {
    base: '/templates/document_type_catalogs'
  },
  [ENDPOINT_KEYS.DOCUMENT_TEMPLATES]: {
    base: '/templates/document_templates'
  },
  [ENDPOINT_KEYS.INTERNAL_TEMPLATES]: {
    base: '/documents/internal_templates'
  },
  [ENDPOINT_KEYS.PROJECTS]: {
    base: '/organization/projects',
    plain: true
  },
  [ENDPOINT_KEYS.PARTIDAS]: {
    base: '/organization/partidas',
    plain: true
  },
  [ENDPOINT_KEYS.INTERNAL_TEMPLATES]: {
    base: '/documents/internal_templates',
    plain: true
  },
  [ENDPOINT_KEYS.ATTACHMENTS]: {
    base: '/attachments',
    specialRoutes: {
      upload: { path: '/attachments/upload', method: 'POST' }
    }
  },
  [ENDPOINT_KEYS.CRON_JOBS]: {
    base: '/settings/cron',
    plain: true,
    specialRoutes: {
      availableTasks: { path: '/settings/cron/available-tasks', method: 'GET', plain: true }
    }
  },
  [ENDPOINT_KEYS.INSTITUTIONS]: {
    base: '/organization/institutions',
    plain: true,
    frontendMapping: InstitutionFrontendMapping,
    specialRoutes: {
      getLogo: { path: '/organization/institutions/:id/assets/logo', method: 'GET', plain: true },
      getEscudo: { path: '/organization/institutions/:id/assets/escudo', method: 'GET', plain: true },
      getBack: { path: '/organization/institutions/:id/assets/back', method: 'GET', plain: true },
      uploadAssets: { path: '/organization/institutions/:id/assets', method: 'POST' }
    }
  },
  [ENDPOINT_KEYS.SUPER_SEED]: {
    base: '/super-seed',
    plain: true
  },
  [ENDPOINT_KEYS.HTML_TEMPLATES]: {
    base: '/html-templates',
    plain: true,
    specialRoutes: {
      getTags: { path: '/html-templates/tags', method: 'GET', plain: true }
    }
  }
};

