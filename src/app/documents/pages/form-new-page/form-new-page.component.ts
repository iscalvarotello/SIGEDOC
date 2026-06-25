import { Component, OnInit, inject, signal, computed, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DocumentService         } from '../../services/document.service';
import { AreaService } from '../../../blocks/CORE_DB/organization/areas/area.service';
import { AreaDTO } from '../../../blocks/CORE_DB/organization/areas/area.dto';
import { AdscriptionService } from '../../../blocks/CORE_DB/rh/adscriptions/adscription.service';
import { DocumentTemplateService } from '../../../blocks/CORE_DB/security/templates/document-template.service';
import { EmployeeService         } from '../../../blocks/CORE_DB/rh/employees/employee.service';

import { ClaseDocumentPipe       } from '../../pipes/claseDocument.pipe';

import { CCP_PHRASES                  } from '../../../core/config/ccp-phrases.config';
import { GenericApiService            } from '../../../core/services/generic-api.service';
import { ENDPOINT_KEYS                } from '../../../core/api/api-routes.config';
import { JobPositionSelectComponent   } from '../../../shared/components/common/job-position-select/job-position-select.component';
import { InternalTemplateService      } from '../../../blocks/CORE_DB/security/internal-templates/internal-template.service';

import { PageBreadcrumbComponent      } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { SesionService                } from '@shared/services/sesion.service';
import { AreaSelectComponent          } from '@shared/components/common/area-select/area-select.component';
import { EmployeeSelectComponent      } from '@shared/components/common/employee-select/employee-select.component';
import { ProjectSelectComponent       } from '@shared/components/common/project-select/project-select.component';
import { PartidaSelectComponent       } from '@shared/components/common/partida-select/partida-select.component';
import { SupplierSelectComponent      } from '@shared/components/common/supplier-select/supplier-select.component';
import { CarSelectComponent           } from '@shared/components/common/car-select/car-select.component';
import { DocumentTypeSelectComponent  } from '@shared/components/common/document-type-select/document-type-select.component';
import { DocumentAttachmentsComponent } from '@shared/components/common/document-attachments/document-attachments.component';
import { DatePickerComponent } from '@shared/components/form/date-picker/date-picker.component';

@Component({
  selector: 'app-form-new-page',
  standalone: true,
  imports: [
    PageBreadcrumbComponent, 
    CommonModule, 
    FormsModule, 
    RouterLink, 
    ClaseDocumentPipe, 
    AreaSelectComponent, 
    EmployeeSelectComponent,
    JobPositionSelectComponent,
    ProjectSelectComponent,
    PartidaSelectComponent,
    SupplierSelectComponent,
    CarSelectComponent,
    DocumentTypeSelectComponent,
    DocumentAttachmentsComponent,
    DatePickerComponent
  ],
  templateUrl: './form-new-page.component.html',
})
export class FormNewPageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  protected _session = inject(SesionService);
  private _documentService = inject(DocumentService);
  private _areaService = inject(AreaService);
  private _adscriptionService = inject(AdscriptionService);
  private _templateService = inject(DocumentTemplateService);
  private _employeeService = inject(EmployeeService);
  private _genericService = inject(GenericApiService);
  private _internalTemplateService = inject(InternalTemplateService);

  // Clase de documento tomada de los parámetros de ruta (memo, oficio, ti, circular)
  claseDocumentoId = signal<any>('memo');

  // Estados del Formulario
  isLoading = signal<boolean>(false);
  allAreas = signal<any[]>([]);
  allTemplates = signal<any[]>([]);

  // Campos del Formulario
  fechaDocumento = signal<string>(new Date().toISOString().substring(0, 10));
  tipoRemitente = signal<'directo' | 'gestionado'>('directo');
  
  // Remitente
  idAreaEmisora = signal<string>('');
  idRemitente = signal<string>('');
  remitenteNombre = signal<string>('');
  remitentePuesto = signal<string>('');
  remitenteAcronimo = signal<string>('');

  // Destinatario
  tipoDestinatarioOficio = signal<'oficial' | 'libre'>('oficial');
  idAreaReceptora = signal<string>('');
  idDestinatarioInterno = signal<string>('');
  destinatarioNombre = signal<string>('');
  destinatarioPuesto = signal<string>('');
  destinatarioTextoLibre = signal<string>('');
  idDestinatarioOficial = signal<string>('');
  officialRecipientsList = signal<any[]>([]);
  selectedOfficialRecipient = computed(() => {
    return this.officialRecipientsList().find(r => r.id === this.idDestinatarioOficial()) || null;
  });

  // Puestos para Circulares
  allJobPositions = signal<any[]>([]);
  circularDestinatariosPuestos = signal<any[]>([]);
  isJobPositionsLoading = signal<boolean>(false);

  // Plantilla & Textos
  idTemplate = signal<string>('');
  tema = signal<string>('');
  temasList = signal<string[]>([]);
  asunto = signal<string>('');
  cuerpo = signal<string>('');

  // Listas de catálogos para campos dinámicos (proyectos, partidas, proveedores, vehículos cargan internamente)
  internalTemplatesList = signal<any[]>([]);

  // Objetos y selecciones activas para campos dinámicos
  selectedProjectObj = signal<any>(null);
  selectedPartidaObj = signal<any>(null);
  selectedSupplierObj = signal<any>(null);
  selectedCarObj = signal<any>(null);

  selectedProjectId = computed(() => this.selectedProjectObj()?.id || '');
  selectedPartidaId = computed(() => this.selectedPartidaObj()?.id || '');
  selectedSupplierId = computed(() => this.selectedSupplierObj()?.id || '');
  selectedCarId = computed(() => this.selectedCarObj()?.id || '');

  selectedMonth = signal<string>('Enero');
  customSupplierAddress = signal<string>('');
  selectedInternalTemplateId = signal<string>('');
  selectedProjectDate = signal<string>(new Date().toISOString().substring(0, 10));

  // Campos libres de la pestaña 'libre'
  customEventName = signal<string>('');
  customEventPlace = signal<string>('');
  customInvoice = signal<string>('');
  customMonto = signal<string>('');

  // Visibilidad de bloques de campos dinámicos
  showProjectFields = signal<boolean>(false);
  showPartidaFields = signal<boolean>(false);
  showMonthFields = signal<boolean>(false);
  showProjectDateFields = signal<boolean>(false);
  showSupplierFields = signal<boolean>(false);
  showSupplierAddressFields = signal<boolean>(false);
  showVehicleFields = signal<boolean>(false);
  showEventNameFields = signal<boolean>(false);
  showEventPlaceFields = signal<boolean>(false);
  showInvoiceFields = signal<boolean>(false);
  showMontoFields = signal<boolean>(false);

  // Pestaña activa del panel lateral
  activeFieldsTab = signal<'proyecto' | 'proveedor' | 'vehiculo' | 'libre' | 'personalizados'>('proyecto');

  // Control para guardar plantilla
  showSaveTemplatePopover = signal<boolean>(false);
  newTemplateName = signal<string>('');
  isSavingTemplate = signal<boolean>(false);

  // Campos personalizados
  personalFieldValues = signal<Record<string, string>>({});
  newCustomFieldName = signal<string>('');
  showCustomFields = signal<boolean>(false);

  activeAreaObj = computed(() => {
    const areaId = this._session.activeAdscription()?.id_area;
    return this.allAreas().find(a => a.id === areaId) || null;
  });

  activeAreaCustomFields = computed(() => {
    return this.activeAreaObj()?.personal_fields_document || [];
  });

  // Diccionario del documento
  bodyDictionary = computed(() => {
    const dict: Record<string, string> = {};
    
    // Proyecto seleccionado
    const proj = this.selectedProjectObj();
    dict['__project_name__'] = proj ? (proj.oficial_name || proj.name) : '';
    dict['__project_code__'] = proj ? proj.code : '';
    dict['__project_type__'] = proj ? proj.type : '';
    dict['__project_cp__'] = proj ? proj.CP : '';
    dict['__project_ca__'] = proj ? proj.CA : '';
    dict['__project_fu__'] = proj ? proj.FU : '';
    dict['__project_sf__'] = proj ? proj.SF : '';
    dict['__project_ai__'] = proj ? proj.AI : '';
    dict['__project_pt__'] = proj ? proj.PT : '';
    dict['__project_oficial_name__'] = proj ? proj.oficial_name : '';

    // Proyecto Fecha
    dict['__project_date_with_day__'] = this.formatProjectDate(this.selectedProjectDate(), 'with_day');
    dict['__project_date_full__'] = this.formatProjectDate(this.selectedProjectDate(), 'full');
    dict['__project_date_compact__'] = this.formatProjectDate(this.selectedProjectDate(), 'compact');
    
    // Partida seleccionada
    const part = this.selectedPartidaObj();
    dict['__partida__'] = part ? (part.full_name || `${part.partida}.- ${part.descripcion}`) : '';
    dict['__partida_clave__'] = part ? part.partida : '';
    dict['__partida_desc__'] = part ? part.descripcion : '';
    
    // Mes de ministración
    dict['__mes_ministracion__'] = this.selectedMonth();
    
    // Proveedor seleccionado
    const sup = this.selectedSupplierObj();
    dict['__provider_name__'] = sup ? (sup.razon_social || sup.name) : '';
    dict['__provider_rfc__'] = sup ? sup.rfc : '';
    dict['__provider_address__'] = this.customSupplierAddress();
    
    // Vehículo seleccionado
    const car = this.selectedCarObj();
    dict['__vehicle_brand__'] = car ? car.marca : '';
    dict['__vehicle_model__'] = car ? car.modelo : '';
    dict['__vehicle_plates__'] = car ? car.placas : '';

    // Campos libres
    dict['__event_name__'] = this.customEventName();
    dict['__lugar_evento__'] = this.customEventPlace();
    dict['__invoice__'] = this.customInvoice();
    
    // Monto y Letra
    const montoVal = parseFloat(this.customMonto());
    dict['__monto_moneda__'] = !isNaN(montoVal) ? this.formatCurrency(this.customMonto()) : '';
    dict['__monto_letra__'] = !isNaN(montoVal) ? this.numeroALetras(montoVal) : '';
    
    // Campos personalizados
    const personalVals = this.personalFieldValues();
    Object.entries(personalVals).forEach(([fieldName, value]) => {
      const keyName = '__personalizado_' + this.normalizeKeyName(fieldName) + '__';
      dict[keyName] = value;
    });

    return dict;
  });

  /**
   * Helper para formatear fechas de proyecto en español
   */
  formatProjectDate(dateStr: string, type: 'with_day' | 'full' | 'compact'): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00'); // Evitar desfase de zona horaria
    if (isNaN(date.getTime())) return '';

    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const monthsCompact = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const monthNameCompact = monthsCompact[date.getMonth()];
    const year = date.getFullYear();

    if (type === 'with_day') {
      return `${dayName} ${dayNum} de ${monthName} del ${year}`;
    } else if (type === 'full') {
      return `${dayNum} de ${monthName} del ${year}`;
    } else if (type === 'compact') {
      return `${dayNum}/${monthNameCompact}/${year}`;
    }
    return '';
  }

  /**
   * Formatea un número en formato moneda ($12,345.67)
   */
  formatCurrency(valStr: string): string {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '';
    const parts = val.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
  }

  /**
   * Convierte un número en letras (español) para importes en pesos
   */
  numeroALetras(num: number): string {
    const unidades = (u: number) => {
      switch(u) {
        case 1: return 'un';
        case 2: return 'dos';
        case 3: return 'tres';
        case 4: return 'cuatro';
        case 5: return 'cinco';
        case 6: return 'seis';
        case 7: return 'siete';
        case 8: return 'ocho';
        case 9: return 'nueve';
      }
      return '';
    };

    const decenas = (d: number, u: number) => {
      const dec = Math.floor(d);
      switch(dec) {
        case 1:
          switch(u) {
            case 0: return 'diez';
            case 1: return 'once';
            case 2: return 'doce';
            case 3: return 'trece';
            case 4: return 'catorce';
            case 5: return 'quince';
            default: return 'dieci' + unidades(u);
          }
        case 2:
          if (u === 0) return 'veinte';
          return 'veinti' + unidades(u);
        case 3: return 'treinta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 4: return 'cuarenta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 5: return 'cincuenta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 6: return 'sesenta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 7: return 'setenta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 8: return 'ochenta' + (u > 0 ? ' y ' + unidades(u) : '');
        case 9: return 'noventa' + (u > 0 ? ' y ' + unidades(u) : '');
      }
      return unidades(u);
    };

    const centenas = (c: number, d: number, u: number) => {
      const cent = Math.floor(c);
      switch(cent) {
        case 1:
          if (d === 0 && u === 0) return 'cien';
          return 'ciento ' + decenas(d, u);
        case 2: return 'doscientos ' + decenas(d, u);
        case 3: return 'trescientos ' + decenas(d, u);
        case 4: return 'cuatrocientos ' + decenas(d, u);
        case 5: return 'quinientos ' + decenas(d, u);
        case 6: return 'seiscientos ' + decenas(d, u);
        case 7: return 'setecientos ' + decenas(d, u);
        case 8: return 'ochocientos ' + decenas(d, u);
        case 9: return 'novecientos ' + decenas(d, u);
      }
      return decenas(d, u);
    };

    if (num === 0) return 'cero';

    const centavos = Math.round((num - Math.floor(num)) * 100);
    const entero = Math.floor(num);

    let strEntero = '';
    if (entero === 1) {
      strEntero = 'un';
    } else if (entero > 1) {
      const millones = Math.floor(entero / 1000000);
      const miles = Math.floor((entero % 1000000) / 1000);
      const restos = entero % 1000;

      if (millones > 0) {
        if (millones === 1) {
          strEntero = 'un millón';
        } else {
          strEntero = centenas(Math.floor(millones / 100) % 10, Math.floor(millones / 10) % 10, millones % 10) + ' millones';
        }
      }

      if (miles > 0) {
        if (miles === 1) {
          strEntero += (strEntero ? ' ' : '') + 'mil';
        } else {
          strEntero += (strEntero ? ' ' : '') + centenas(Math.floor(miles / 100) % 10, Math.floor(miles / 10) % 10, miles % 10) + ' mil';
        }
      }

      if (restos > 0) {
        strEntero += (strEntero ? ' ' : '') + centenas(Math.floor(restos / 100) % 10, Math.floor(restos / 10) % 10, restos % 10);
      }
    }

    strEntero = strEntero.trim();
    let sufijo = entero === 1 ? 'peso' : 'pesos';
    
    if (entero % 1000000 === 0 && entero > 0) {
      sufijo = 'de pesos';
    }

    let resultado = strEntero + ' ' + sufijo;
    resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);

    const strCentavos = centavos.toString().padStart(2, '0') + '/100 M.N.';
    return `${resultado} ${strCentavos}`;
  }

  // Con Copia Para (C.C.P.)
  ccps = signal<any[]>([]); // { id_area: string, id_empleado: string, area_name: string, employee_name: string, motivo: string }[]
  ccpAreaId = signal<string>('');
  ccpEmployeeId = signal<string>('');
  ccpEmployeesList = signal<any[]>([]);
  ccpPhrases = CCP_PHRASES;
  selectedCcpPhrase = signal<string>('Para su conocimiento');
  customCcpPhrase = signal<string>('');

  // Anexos
  anexos = signal<{ id_attachment: string; attachment_name: string; attachment_title: string; source_type?: 'supplier' | 'pure'; source_name?: string; }[]>([]);

  // Filtrado de plantillas correspondientes a la clase seleccionada (incluyendo las personalizadas)
  templatesForClass = computed(() => {
    const clase = this.claseDocumentoId();
    return this.allTemplates().filter((t: any) => 
      (t.type_doc_code === clase || t.type_doc_code === 'custom_' + clase) && t.active
    );
  });

  constructor() {
    effect(() => {
      // Reactivamente recargar plantillas internas al cambiar la clase de documento o la adscripción activa
      const clase = this.claseDocumentoId();
      const adscription = this._session.activeAdscription();
      this.loadDynamicFieldsCatalogs();
    }, { allowSignalWrites: true });

    effect(() => {
      const areaId = this.idAreaEmisora();
      console.log('🔍 [DEBUG] Effect idAreaEmisora changed to:', areaId);
      if (areaId) {
        this.loadTemas(areaId);
      } else {
        this.temasList.set([]);
      }
    }, { allowSignalWrites: true });
  }

  async loadTemas(areaId: string) {
    console.log('🔍 [DEBUG] loadTemas started for areaId:', areaId);
    try {
      const list = await this._areaService.getTemas(areaId);
      console.log('🔍 [DEBUG] loadTemas fetched list:', list);
      this.temasList.set(list || []);
    } catch (e) {
      console.warn('🔍 [DEBUG] GET /organization/areas/:id/temas not implemented or failed:', e);
      this.temasList.set([]);
    }
  }

  changeTipoRemitente(type: 'directo' | 'gestionado') {
    this.tipoRemitente.set(type);
    if (type === 'directo') {
      this.loadDirectoRemitente();
    } else {
      this.idAreaEmisora.set('');
      this.idRemitente.set('');
      this.remitenteNombre.set('');
      this.remitentePuesto.set('');
      this.remitenteAcronimo.set('');
    }
  }

  onClaseDocumentoChange(newClase: any) {
    // Navegar para actualizar el parámetro en la URL. Esto activará la suscripción
    // de params en ngOnInit, la cual actualizará el signal y recargará las plantillas.
    this._router.navigate(['/form-new-document', newClase], {
      queryParams: this._route.snapshot.queryParams,
      queryParamsHandling: 'merge'
    });
  }

  ngOnInit() {
    // Suscribirse a parámetros de ruta para la clase de documento
    this._route.params.subscribe(params => {
      if (params['claseDocumentoId']) {
        this.claseDocumentoId.set(params['claseDocumentoId']);
      }
      this.loadTemplates();
    });

    // Cargar catálogos iniciales
    this.loadAreas();
    this.loadOfficialRecipients();
    this.loadJobPositions();
    this.loadDynamicFieldsCatalogs();
    
    if (this.tipoRemitente() === 'directo') {
      this.loadDirectoRemitente();
    }
    
    // Suscribirse a queryParams de manera reactiva en lugar de usar snapshot.queryParams
    this._route.queryParams.subscribe(qp => {
      this.handleQueryParams(qp);
    });
  }

  /**
   * Carga plantillas internas de cuerpo
   */
  async loadDynamicFieldsCatalogs() {
    try {
      const activeArea = this._session.activeAdscription()?.id_area || '';
      const clase = this.claseDocumentoId();
      
      if (clase) {
        const intTemps = await this._internalTemplateService.getAll({
          active: true,
          area_id: activeArea,
          tipo_documento: clase
        });
        this.internalTemplatesList.set(intTemps.data || []);
      } else {
        this.internalTemplatesList.set([]);
      }
    } catch (err) {
      console.error('Error al cargar catálogo de plantillas internas:', err);
    }
  }

  /**
   * Carga todas las áreas organizacionales
   */
  async loadAreas() {
    try {
      const res = await this._areaService.getAll();
      this.allAreas.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar catálogo de áreas:', err);
    }
  }

  /**
   * Carga todos los destinatarios oficiales externos
   */
  async loadOfficialRecipients() {
    try {
      const res = await this._genericService.getDropdownOptions(ENDPOINT_KEYS.OFFICIAL_RECIPIENTS);
      this.officialRecipientsList.set(res || []);
    } catch (err) {
      console.error('Error al cargar catálogo de destinatarios oficiales:', err);
    }
  }

  /**
   * Carga todos los puestos de la base de datos
   */
  async loadJobPositions(forceRefresh = false) {
    this.isJobPositionsLoading.set(true);
    if (forceRefresh) {
      this._genericService.clearCache(ENDPOINT_KEYS.JOB_POSITIONS);
    }
    try {
      const res = await this._genericService.getDropdownOptions(
        ENDPOINT_KEYS.JOB_POSITIONS,
        { active: true },
        { enabled: true, ttlMinutes: 15 }
      );
      this.allJobPositions.set(res || []);
    } catch (err) {
      console.error('Error al cargar catálogo de puestos:', err);
    } finally {
      this.isJobPositionsLoading.set(false);
    }
  }

  /**
   * Agrega un puesto a la lista de destinatarios de la circular
   */
  addCircularJobPosition(jp: any) {
    if (!jp) return;
    
    if (jp.id === 'ALL_EMPLOYES') {
      // Si se selecciona "Todo el personal", limpia cualquier otro puesto
      this.circularDestinatariosPuestos.set([jp]);
    } else {
      // Si se selecciona un puesto específico, quita "Todo el personal" si estuviera seleccionado
      this.circularDestinatariosPuestos.update(list => {
        const filtered = list.filter(item => item.id !== 'ALL_EMPLOYES');
        if (!filtered.some(item => item.id === jp.id)) {
          return [...filtered, jp];
        }
        return filtered;
      });
    }
  }

  /**
   * Remueve un puesto de la lista de destinatarios de la circular
   */
  removeCircularJobPosition(id: string) {
    this.circularDestinatariosPuestos.update(list => list.filter(item => item.id !== id));
  }

  /**
   * Carga las plantillas disponibles
   */
  async loadTemplates() {
    try {
      const res = await this._templateService.getAll();
      this.allTemplates.set(res.data || []);
      
      // Auto-seleccionar la primera plantilla disponible
      setTimeout(() => {
        const filtered = this.templatesForClass();
        if (filtered.length > 0) {
          this.idTemplate.set(filtered[0].id);
        }
      }, 300);
    } catch (err) {
      console.error('Error al cargar catálogo de plantillas:', err);
    }
  }

  /**
   * Carga los datos del titular del área base activa
   */
  async loadDirectoRemitente() {
    const activeAds = this._session.activeAdscription();
    console.log('🔍 [DEBUG] activeAdscription from session:', activeAds);
    const areaBaseId = activeAds?.id_area_base || activeAds?.id_area;
    console.log('🔍 [DEBUG] resolved areaBaseId:', areaBaseId);
    if (!areaBaseId) return;

    try {
      const res = await this._adscriptionService.getByArea(areaBaseId);
      const adscriptions = res.data || [];
      console.log('🔍 [DEBUG] adscriptions resolved:', adscriptions);
      const head = adscriptions.find((a: any) => a.is_head || a.is_in_charge) || adscriptions[0];
      console.log('🔍 [DEBUG] selected head:', head);
      if (head) {
        this.idAreaEmisora.set(areaBaseId);
        this.idRemitente.set(head.employee_id);
        this.remitenteNombre.set(head.fullName);
        this.remitentePuesto.set(head.resolvedJobPosition);
        this.remitenteAcronimo.set(head.area_acronym || '');
      }
    } catch (err) {
      console.error('Error cargando remitente directo:', err);
    }
  }

  /**
   * Carga los datos del titular del área seleccionada (Bajo gestión)
   */
  async onGestionadoAreaChange(area: AreaDTO | string, targetEmployeeId?: string) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    if (!areaId) {
      this.idAreaEmisora.set('');
      this.idRemitente.set('');
      this.remitenteNombre.set('');
      this.remitentePuesto.set('');
      this.remitenteAcronimo.set('');
      return;
    }

    try {
      const res = await this._adscriptionService.getByArea(areaId);
      const adscriptions = res.data || [];
      const selectedAds = targetEmployeeId 
        ? adscriptions.find((a: any) => a.employee_id === targetEmployeeId)
        : null;
      const match = selectedAds || adscriptions.find((a: any) => a.is_head || a.is_in_charge) || adscriptions[0];
      if (match) {
        this.idAreaEmisora.set(areaId);
        this.idRemitente.set(match.employee_id);
        this.remitenteNombre.set(match.fullName);
        this.remitentePuesto.set(match.resolvedJobPosition);
        this.remitenteAcronimo.set(match.area_acronym || '');
      }
    } catch (err) {
      console.error('Error cargando remitente gestionado:', err);
    }
  }

  /**
   * Carga los datos del destinatario al seleccionar un área interna (Memo / TI / Oficio Oficial)
   */
  async onDestinatarioAreaChange(area: AreaDTO | string, targetEmployeeId?: string) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.idAreaReceptora.set(areaId);
    if (!areaId) {
      this.idDestinatarioInterno.set('');
      this.destinatarioNombre.set('');
      this.destinatarioPuesto.set('');
      return;
    }

    try {
      const res = await this._adscriptionService.getByArea(areaId);
      const adscriptions = res.data || [];
      const selectedAds = targetEmployeeId 
        ? adscriptions.find((a: any) => a.employee_id === targetEmployeeId)
        : null;
      const match = selectedAds || adscriptions.find((a: any) => a.is_head || a.is_in_charge) || adscriptions[0];
      if (match) {
        this.idDestinatarioInterno.set(match.employee_id);
        this.destinatarioNombre.set(match.fullName);
        this.destinatarioPuesto.set(match.resolvedJobPosition);
      }
    } catch (err) {
      console.error('Error cargando destinatario de área:', err);
    }
  }

  /**
   * Actualiza el destinatario oficial seleccionado
   */
  onOfficialRecipientChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.idDestinatarioOficial.set(val);
  }

  isCcpEmployeesLoading = signal<boolean>(false);

  /**
   * Carga los empleados de un área para los selectores de C.C.P.
   */
  async onCcpAreaChange(area: AreaDTO | string, forceRefresh = false) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.ccpAreaId.set(areaId);
    this.ccpEmployeeId.set('');
    if (!areaId) {
      this.ccpEmployeesList.set([]);
      return;
    }
    this.isCcpEmployeesLoading.set(true);
    try {
      const res = await this._employeeService.getByArea(areaId, forceRefresh);
      this.ccpEmployeesList.set(res.data || []);
      if (res.data && res.data.length > 0) {
        this.ccpEmployeeId.set(res.data[0].employee_id);
      }
    } catch (err) {
      console.error('Error cargando lista de empleados para CCP:', err);
    } finally {
      this.isCcpEmployeesLoading.set(false);
    }
  }

  onCcpEmployeeSelect(emp: any) {
    if (emp) {
      this.ccpEmployeeId.set(emp.employee_id || emp.id_employee || '');
    }
  }

  onCcpEmployeeClear() {
    this.ccpEmployeeId.set('');
  }

  onCcpPhraseChange(val: string) {
    this.selectedCcpPhrase.set(val);
    if (val !== 'Otro') {
      this.customCcpPhrase.set('');
    }
  }

  /**
   * Agrega un C.C.P. al listado del documento
   */
  addCcp() {
    if (!this.ccpAreaId() || !this.ccpEmployeeId()) return;

    const area = this.allAreas().find(a => a.id === this.ccpAreaId());
    const emp = this.ccpEmployeesList().find(e => e.employee_id === this.ccpEmployeeId());

    if (area && emp) {
      const motivoText = this.selectedCcpPhrase() === 'Otro' ? this.customCcpPhrase().trim() : this.selectedCcpPhrase();
      const item = {
        id_area: this.ccpAreaId(),
        id_empleado: this.ccpEmployeeId(),
        area_name: area.acronym || area.name,
        employee_name: emp.fullName,
        motivo: motivoText || 'Para su conocimiento'
      };

      if (!this.ccps().some(c => c.id_empleado === item.id_empleado)) {
        this.ccps.update(list => [...list, item]);
      }

      // Resetear inputs de CCP
      this.ccpEmployeeId.set('');
      this.ccpEmployeesList.set([]);
      this.ccpAreaId.set('');
      this.selectedCcpPhrase.set('Para su conocimiento');
      this.customCcpPhrase.set('');
    }
  }

  removeCcp(employeeId: string) {
    this.ccps.update(list => list.filter(c => c.id_empleado !== employeeId));
  }

  /**
   * Intenta parsear una fecha en formato ISO o local DD/MM/YYYY sin desfase de zona horaria
   */
  parseLocalDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    
    // Intenta YYYY-MM-DD
    const partsDash = cleanStr.split('-');
    if (partsDash.length === 3) {
      const y = parseInt(partsDash[0], 10);
      const m = parseInt(partsDash[1], 10) - 1;
      const d = parseInt(partsDash[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d, 12, 0, 0);
      }
    }

    // Intenta DD/MM/YYYY o YYYY/MM/DD
    const partsSlash = cleanStr.split('/');
    if (partsSlash.length === 3) {
      const p0 = parseInt(partsSlash[0], 10);
      const p1 = parseInt(partsSlash[1], 10) - 1;
      const p2 = parseInt(partsSlash[2], 10);
      if (!isNaN(p0) && !isNaN(p1) && !isNaN(p2)) {
        if (p0 > 1000) {
          // YYYY/MM/DD
          return new Date(p0, p1, p2, 12, 0, 0);
        } else {
          // DD/MM/YYYY
          return new Date(p2, p1, p0, 12, 0, 0);
        }
      }
    }

    const d = new Date(cleanStr + 'T12:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  async handleQueryParams(qp: any) {
    let draftId: string | null = null;
    let actionType: 'seguimiento' | 'respuesta' | null = null;

    if (qp['reply_to']) {
      draftId = qp['reply_to'];
      actionType = 'respuesta';
    } else if (qp['follow_up_to']) {
      draftId = qp['follow_up_to'];
      actionType = 'seguimiento';
    }

    if (draftId && actionType) {
      this.isLoading.set(true);
      try {
        // Asegurar que las áreas globales estén cargadas antes de procesar CCP
        if (this.allAreas().length === 0) {
          const res = await this._areaService.getAll();
          this.allAreas.set(res.data || []);
        }

        const draftRes = await this._documentService.getDraftAction(draftId, actionType);
        const draft = draftRes && draftRes.data !== undefined ? draftRes.data : draftRes;
        if (draft) {
          this.asunto.set(draft.asunto || '');
          this.cuerpo.set(draft.cuerpo || '');
          this.tema.set(draft.tema || '');
          
          if (draft.id_area_emisora) {
            const activeAdscription = this._session.activeAdscription();
            const userAreaBaseId = activeAdscription?.id_area_base || activeAdscription?.id_area;
            const isDirect = String(draft.id_area_emisora) === String(userAreaBaseId);
            
            this.tipoRemitente.set(isDirect ? 'directo' : 'gestionado');
            this.idAreaEmisora.set(draft.id_area_emisora);
            if (isDirect) {
              await this.loadDirectoRemitente();
            } else {
              await this.onGestionadoAreaChange(draft.id_area_emisora, draft.id_remitente);
            }
          }
          if (draft.id_area_receptora) {
            this.idAreaReceptora.set(draft.id_area_receptora);
            await this.onDestinatarioAreaChange(draft.id_area_receptora, draft.id_destinatario_interno);
          }

          if (draft.ccp && draft.ccp.length > 0) {
            const mappedCcps: any[] = [];
            for (const c of draft.ccp) {
              const area = this.allAreas().find(a => a.id === c.id_area);
              const areaName = area ? (area.acronym || area.name) : '';
              let empName = 'Colaborador';
              try {
                const empsRes = await this._employeeService.getByArea(c.id_area);
                const emp = (empsRes.data || []).find((e: any) => e.employee_id === c.id_empleado || e.id === c.id_empleado);
                if (emp) {
                  empName = emp.fullName || 'Colaborador';
                }
              } catch (err) {
                console.error('Error fetching employee for draft CCP:', err);
              }
              mappedCcps.push({
                id_area: c.id_area,
                id_empleado: c.id_empleado,
                area_name: areaName,
                employee_name: empName,
                motivo: c.motivo || 'Para su conocimiento'
              });
            }
            this.ccps.set(mappedCcps);
          }
        }
      } catch (error) {
        console.error('Error al cargar el borrador del documento original:', error);
        alert('Ocurrió un error al precargar el borrador del documento original.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Inicialización regular si no es respuesta/seguimiento
      if (this.claseDocumentoId() === 'circular') {
        this.destinatarioTextoLibre.set('Directores, Subsecretarios y Jefes de Departamento');
      }
    }
  }

  /**
   * Estandariza el nombre formateado de un área
   */
  getAreaFormattedName(area: any): string {
    if (!area) return '';
    const typeName = area.area_type && typeof area.area_type === 'object' 
      ? (area.area_type as any).name 
      : area.area_type;
    const name = area.name || '';
    if (typeName && name.toLowerCase().startsWith(typeName.toLowerCase())) {
      return name;
    }
    return [typeName, area.connector, name].filter(Boolean).join(' ');
  }

  /**
   * Obtiene la descripción formal del puesto con sensibilidad de género si aplica
   */
  getResolvedJobPosition(ads: any, sex = ''): string {
    if (!ads) return 'Colaborador';
    if (ads.resolvedJobPosition) return ads.resolvedJobPosition;
    if (ads.job_position) {
      return (sex === 'F' && ads.job_position.name_fem) 
        ? ads.job_position.name_fem 
        : (ads.job_position.name || 'Colaborador');
    }
    return ads.area_type_name || 'Personal Operativo';
  }

  /**
   * Envía el formulario para crear el documento en base de datos y generar Drive
   */
  async onSubmit() {
    const solicitanteId = this._session.currentUserData()?.id_empleado;
    if (!solicitanteId) {
      alert('Sesión inválida. Debe estar autenticado.');
      return;
    }

    if (!this.idRemitente()) {
      alert('Falta especificar el remitente del documento.');
      return;
    }

    if (!this.idTemplate()) {
      alert('Debe seleccionar una plantilla.');
      return;
    }

    if (!this.asunto().trim()) {
      alert('El campo de asunto es requerido.');
      return;
    }

    const qp = this._route.snapshot.queryParams;
    const payload: any = {
      clase_documento: this.claseDocumentoId(),
      tipo_documento: this.tipoRemitente() === 'directo' ? 'directo' : 'gestionado',
      id_template: this.idTemplate(),
      id_solicitante: solicitanteId,
      id_remitente: this.idRemitente(),
      id_area_emisora: this.idAreaEmisora(),
      id_area_remitente: this.idAreaEmisora(),
      asunto: this.asunto().trim(),
      tema: this.tema().trim(),
      cuerpo: this.cuerpo().trim(),
      body_dictionary: this.bodyDictionary(),
      ccp: this.ccps().map(c => ({
        id_area: c.id_area,
        id_empleado: c.id_empleado,
        motivo: c.motivo
      })),
      attachments: this.anexos().map(a => ({
        id_attachment: a.id_attachment,
        attachment_name: a.attachment_name,
        attachment_title: a.attachment_title
      }))
    };

    // Relaciones de seguimiento y respuestas se gestionan mediante endpoints especializados y UUIDs

    // Validación y empaquetado del Destinatario según la clase
    const clase = this.claseDocumentoId();
    if (clase === 'memo' || clase === 'ti') {
      if (!this.idAreaReceptora()) {
        alert('Debe seleccionar el área destinataria.');
        return;
      }
      payload.id_area_receptora = this.idAreaReceptora();
      payload.id_destinatario_interno = this.idDestinatarioInterno();
    } 
    else if (clase === 'oficio') {
      if (this.tipoDestinatarioOficio() === 'oficial') {
        if (!this.idDestinatarioOficial()) {
          alert('Debe seleccionar el destinatario oficial.');
          return;
        }
        payload.id_destinatario_oficial = this.idDestinatarioOficial();
      } else {
        if (!this.destinatarioTextoLibre().trim()) {
          alert('Escriba el nombre y detalles del destinatario externo.');
          return;
        }
        payload.destinatario_texto_libre = this.destinatarioTextoLibre().trim();
      }
    } 
    else if (clase === 'circular') {
      const ids = this.circularDestinatariosPuestos().map(jp => jp.id);
      if (ids.length === 0) {
        alert('Debe agregar al menos un destinatario para la circular.');
        return;
      }
      payload.destinatarios_circular = ids;
    }

    // Inyección de metadatos desnormalizados para optimizar lecturas del Inbox
    const metadatos: any = {};

    // 1. Solicitante (usuario logueado en sesión)
    const user = this._session.currentUserData();
    const pers = user?.datos_personales;
    const ads = this._session.activeAdscription();
    if (pers) {
      const prefix = pers.prefix ? `${pers.prefix.trim()} ` : '';
      metadatos.solicitante_nombre = `${prefix}${pers.name || ''} ${pers.first_surname || ''} ${pers.second_surname || ''}`.replace(/\s+/g, ' ').trim();
      metadatos.solicitante_puesto = this.getResolvedJobPosition(ads, pers.sex);
    }

    // 2. Remitente
    if (this.idRemitente()) {
      metadatos.remitente_nombre = this.remitenteNombre();
      metadatos.remitente_puesto = this.remitentePuesto();
    }

    // 3. Áreas emisora y remitente
    if (this.idAreaEmisora()) {
      const emisoraObj = this.allAreas().find(a => a.id === this.idAreaEmisora());
      if (emisoraObj) {
        const desc = this.getAreaFormattedName(emisoraObj);
        metadatos.area_emisora_nombre = desc;
        metadatos.area_remitente_nombre = desc;
      }
    }

    // 4. Área receptora y destinatario interno (Memos, Tarjetas Informativas u Oficio Oficial si aplica)
    if (clase === 'memo' || clase === 'ti' || (clase === 'oficio' && this.tipoDestinatarioOficio() === 'oficial')) {
      if (this.idAreaReceptora()) {
        const receptoraObj = this.allAreas().find(a => a.id === this.idAreaReceptora());
        if (receptoraObj) {
          metadatos.area_receptora_nombre = this.getAreaFormattedName(receptoraObj);
        }
      }
      if (this.idDestinatarioInterno()) {
        metadatos.destinatario_interno_nombre = this.destinatarioNombre();
        metadatos.destinatario_interno_puesto = this.destinatarioPuesto();
      }
    }

    // 4.1. Circular: Nombres de los puestos a los que se les envió la circular
    if (clase === 'circular') {
      const postsNames = this.circularDestinatariosPuestos().map(jp => 
        jp.id === 'ALL_EMPLOYES' ? 'Todo el personal' : (jp.name_plural || jp.name)
      );
      metadatos.destinatario_interno_nombre = postsNames.join(', ');
    }

    // 5. Destinatario Oficial Externo (Oficios con destinatario registrado)
    if (clase === 'oficio' && this.tipoDestinatarioOficio() === 'oficial') {
      const destOficial = this.selectedOfficialRecipient();
      if (destOficial) {
        metadatos.destinatario_oficial_nombre = destOficial.fullName || destOficial.name || '';
        metadatos.destinatario_oficial_puesto = destOficial.job_position || '';
      }
    }

    payload.metadatos_desnormalizados = metadatos;

    this.isLoading.set(true);
    try {
      if (qp['follow_up_to']) {
        payload.id_documento_original = qp['follow_up_to'];
        await this._documentService.followUp(qp['follow_up_to'], payload);
      } else if (qp['reply_to']) {
        payload.id_documento_original = qp['reply_to'];
        await this._documentService.reply(qp['reply_to'], payload);
      } else {
        await this._documentService.create(payload);
      }

      // Guardar el tema si es nuevo
      const newTema = this.tema().trim();
      const areaId = this.idAreaEmisora();
      if (newTema && areaId && !this.temasList().includes(newTema)) {
        try {
          await this._areaService.addTema(areaId, newTema);
        } catch (e) {
          console.warn('Failed to save new theme to area list:', e);
        }
      }

      alert('Documento creado con éxito en SIGEDOC. Redirigiendo a bandeja.');
      this._router.navigate(['/documento', this.claseDocumentoId()], { queryParams: { bandeja: '✏️ En edición' } });
    } catch (error: any) {
      console.error('Error al guardar documento:', error);
      alert(
        error?.error?.message || 
        error?.message || 
        'Ocurrió un error al intentar crear el documento y clonarlo en Drive.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inserta una etiqueta en la posición actual del cursor dentro del cuerpo
   */
  insertTag(tag: string) {
    const textarea = document.getElementById('document-body-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      this.cuerpo.set(this.cuerpo() + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.cuerpo();
    const newText = text.substring(0, start) + tag + text.substring(end);
    this.cuerpo.set(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  /**
   * Carga una plantilla interna seleccionada en el cuerpo
   */
  loadInternalTemplate(templateId: string) {
    this.selectedInternalTemplateId.set(templateId);
    if (!templateId) return;
    const temp = this.internalTemplatesList().find(t => t.id === templateId);
    if (temp) {
      this.cuerpo.set(temp.body);
    }
  }

  /**
   * Guarda el cuerpo actual como plantilla interna asociada al área base
   */
  async saveAsInternalTemplate() {
    const name = this.newTemplateName().trim();
    if (!name) {
      alert('Debe proporcionar un nombre para la plantilla.');
      return;
    }
    const bodyText = this.cuerpo().trim();
    if (!bodyText) {
      alert('El cuerpo del documento no puede estar vacío.');
      return;
    }

    const activeAreaId = this._session.activeAdscription()?.id_area || null;
    const clase = this.claseDocumentoId();
    
    this.isSavingTemplate.set(true);
    try {
      const newTemp = await this._internalTemplateService.create({
        name,
        body: bodyText,
        area_id: activeAreaId,
        tipo_documento: clase,
        active: true
      });
      
      alert('Plantilla guardada con éxito.');
      this.newTemplateName.set('');
      this.showSaveTemplatePopover.set(false);
      
      // Recargar plantillas
      await this.loadDynamicFieldsCatalogs();
      this.selectedInternalTemplateId.set(newTemp.id);
    } catch (err: any) {
      console.error('Error al guardar plantilla interna:', err);
      alert(err?.error?.message || err?.message || 'Error al guardar la plantilla.');
    } finally {
      this.isSavingTemplate.set(false);
    }
  }

  onPersonalFieldValueChange(fieldName: string, value: string) {
    this.personalFieldValues.update(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  normalizeKeyName(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  async addCustomField() {
    const fieldName = this.newCustomFieldName().trim();
    if (!fieldName) return;
    const activeAreaId = this._session.activeAdscription()?.id_area;
    if (!activeAreaId) {
      alert('No se pudo determinar el área activa.');
      return;
    }
    if (this.activeAreaCustomFields().includes(fieldName)) {
      alert('Este campo ya está registrado.');
      return;
    }
    try {
      await this._areaService.addCustomDocumentField(activeAreaId, fieldName);
      this.newCustomFieldName.set('');
      await this.loadAreas();
    } catch (err) {
      console.error('Error al registrar campo personalizado:', err);
      alert('Error al registrar el campo.');
    }
  }
}
