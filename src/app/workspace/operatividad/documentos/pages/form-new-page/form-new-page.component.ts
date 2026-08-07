import { Component, OnInit, inject, signal, computed, effect, input } from '@angular/core';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ListboxOption } from '@system-shared/form/listbox/base-listbox.directive';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { CommonModule                 } from '@angular/common';
import { FormsModule                  } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DocumentService              } from '../../services/document.service';
import { AreaService } from '@organization/areas/area.service';
import { AreaDTO } from '@organization/areas/area.dto';
import { InternalTemplatesService, InternalTemplateDTO } from '../../../../database/templates/internal-templates.service';
import { AdscriptionService           } from '@rh/adscriptions/adscription.service';
import { DocumentTemplateService      } from '@security/templates/document-template.service';
import { EmployeeService              } from '@rh/employees/employee.service';
import { AttachmentService            } from '@core/services/attachment.service';
import { ClaseDocumentPipe            } from '../../pipes/claseDocument.pipe';
import { numeroALetras                } from '@core/utils/number-to-letters.util';
import { CCP_PHRASES                  } from '@core/config/app.ccp-phrases.config';
import { GenericApiService            } from '@core/services/generic-api.service';
import { ENDPOINT_KEYS                } from '@core/api/api-routes.config';
import { JobPositionSelectComponent   } from '@workspace-shared/components/selects/job-position-select/job-position-select.component';
import { PageBreadcrumbComponent      } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { SesionService                } from '@services/sesion.service';
import { AreaSelectComponent          } from '@workspace-shared/components/selects/area-select/area-select.component';
import { EmployeeSelectComponent      } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { ProjectSelectComponent       } from '@workspace-shared/components/selects/project-select/project-select.component';
import { PartidaSelectComponent       } from '@workspace-shared/components/selects/partida-select/partida-select.component';
import { SupplierSelectComponent      } from '@workspace-shared/components/selects/supplier-select/supplier-select.component';
import { CarSelectComponent           } from '@workspace-shared/components/selects/car-select/car-select.component';
import { DocumentTypeSelectComponent  } from '@workspace-shared/components/selects/document-type-select/document-type-select.component';
import { DocumentAttachmentsComponent } from '@workspace-shared/components/media/document-attachments/document-attachments.component';
import { DatePickerComponent          } from '@system-shared/form/date-picker/date-picker.component';
import { SubmitButtonComponent        } from '@system-shared/buttons/submit-button/submit-button.component';
import { CancelButtonComponent        } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { LocalRouteService            } from '@core/routing/local-route.service';
import { LocalRoutePipe               } from '@core/routing/local-route.pipe';
import { LOCAL_ROUTE_KEYS             } from '@core/routing/local-routes.config';
import { ExternalContactSelectComponent } from '@workspace-shared/components/selects/external-contact-select/external-contact-select.component';

import { TopicComponent } from '@system-shared/form/topic/topic.component';
import { TemplateManagerComponent } from '@workspace-shared/components/template-manager/template-manager.component';

@Component({
  selector: 'app-form-new-page',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, ClaseDocumentPipe, PageBreadcrumbComponent, AreaSelectComponent,
    EmployeeSelectComponent, ProjectSelectComponent, PartidaSelectComponent, SupplierSelectComponent, CarSelectComponent,
    DocumentTypeSelectComponent, DocumentAttachmentsComponent, DatePickerComponent, SubmitButtonComponent, CancelButtonComponent,
    JobPositionSelectComponent, LocalRoutePipe, ExternalContactSelectComponent, IconComponent, ActionButtonComponent, TopicComponent, TemplateManagerComponent
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
  protected _localRoute = inject(LocalRouteService);
  protected ROUTES = LOCAL_ROUTE_KEYS;

  claseDocumentoId = signal<any>('memo');

  // Estados del Formulario
  isLoading = signal<boolean>(false);
  allAreas = signal<any[]>([]);
  allEmployees = signal<any[]>([]);
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
  idContactoExterno = signal<string>('');
  selectedExternalContact = signal<any | null>(null);

  // Puestos para Circulares
  allJobPositions = signal<any[]>([]);
  circularDestinatariosPuestos = signal<any[]>([]);
  isJobPositionsLoading = signal<boolean>(false);

  // Plantilla & Textos
  idTemplate = signal<string>('');
  temas = signal<string>('');
  temasList = signal<string[]>([]);
  asunto = signal<string>('');
  cuerpo = signal<string>('');

  // Listas de catálogos para campos dinámicos
  internalTemplatesList = signal<InternalTemplateDTO[]>([]);
  selectedInternalTemplateId = signal<string>('');

  // Objetos y selecciones activas para campos dinÃ¡micos
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

  selectedProjectDate = signal<string>(new Date().toISOString().substring(0, 10));

  // Campos libres de la pestaÃ±a 'libre'
  customEventName = signal<string>('');
  customEventPlace = signal<string>('');
  customInvoice = signal<string>('');
  customMonto = signal<string>('');
  customFecha = signal<string>(new Date().toISOString().substring(0, 10));

  // Visibilidad de bloques de campos dinÃ¡micos
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
  showFechaFields = signal<boolean>(false);

  private internalTemplateService = inject(InternalTemplatesService);

  // PestaÃ±a activa del panel lateral
  activeFieldsTab = signal<'proyecto' | 'proveedor' | 'vehiculo' | 'evento' | 'personalizados' | 'general'>('proyecto');

  // Control para guardar plantilla
  showSaveTemplatePopover = signal<boolean>(false);
  showTemplateManager = signal<boolean>(false);
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
    
    // Mes de ministraciÃ³n
    dict['__mes_ministracion__'] = this.selectedMonth();
    
    // Proveedor seleccionado
    const sup = this.selectedSupplierObj();
    dict['__provider_name__'] = sup ? (sup.razon_social || sup.name) : '';
    dict['__provider_rfc__'] = sup ? sup.rfc : '';
    dict['__provider_address__'] = this.customSupplierAddress();
    
    // VehÃ­culo seleccionado
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
   * Helper para formatear fechas de proyecto en espaÃ±ol
   */
  formatProjectDate(dateStr: string, type: 'with_day' | 'full' | 'compact'): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00'); // Evitar desfase de zona horaria
    if (isNaN(date.getTime())) return '';

    const days = ['domingo', 'lunes', 'martes', 'miÃ©rcoles', 'jueves', 'viernes', 'sÃ¡bado'];
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
   * Formatea un nÃºmero en formato moneda ($12,345.67)
   */
  formatCurrency(valStr: string): string {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '';
    const parts = val.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
  }

  /**
   * Convierte un nÃºmero en letras (espaÃ±ol) para importes en pesos
   */
  numeroALetras(num: number): string {
    return numeroALetras(num);
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
  anexos = signal<{ id_attachment: string; attachment_name: string; attachment_title: string; extension?: string; source_type?: 'supplier' | 'pure'; source_name?: string; }[]>([]);

  // Filtrado de plantillas correspondientes a la clase seleccionada (incluyendo las personalizadas)
  templatesForClass = computed(() => {
    const clase = this.claseDocumentoId();
    return this.allTemplates().filter((t: any) => 
      (t.type_doc_code === clase || t.type_doc_code === 'custom_' + clase) && t.active
    );
  });

  mainTemplatesListboxOptions = computed<ListboxOption[]>(() => {
    return this.templatesForClass().map((t: any) => ({
      value: t.id,
      label: t.name
    }));
  });



  constructor() {
    effect(() => {
      // Reactivamente recargar plantillas internas al cambiar la clase de documento o la adscripción activa
      const clase = this.claseDocumentoId();
      const adscription = this._session.activeAdscription();
      this.loadDynamicFieldsCatalogs();
      if (clase && adscription?.id_area) {
        this.loadInternalTemplatesList(clase, adscription.id_area);
      }
    });

    effect(() => {
      const areaId = this.idAreaEmisora();
      console.log('ðŸ”  [DEBUG] Effect idAreaEmisora changed to:', areaId);
      if (areaId) {
        this.loadTemas(areaId);
      } else {
        this.temasList.set([]);
      }
    });
  }

  async loadTemas(areaId: string) {
    console.log('ðŸ” [DEBUG] loadTemas started for areaId:', areaId);
    try {
      const list = await this._areaService.getTemas(areaId);
      console.log('ðŸ” [DEBUG] loadTemas fetched list:', list);
      this.temasList.set(list || []);
    } catch (e) {
      console.warn('ðŸ” [DEBUG] GET /organization/areas/:id/temas not implemented or failed:', e);
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

  onClaseDocumentoChange(newClase: string) {
    if (newClase !== this.claseDocumentoId()) {
      this._localRoute.go(this.ROUTES.NEW_DOCUMENT, { id: newClase }, {
        reply_to: this._route.snapshot.queryParams['reply_to'],
        follow_up_to: this._route.snapshot.queryParams['follow_up_to']
      });
    }
  }

  ngOnInit() {
    // Suscribirse a parÃ¡metros de ruta para la clase de documento
    this._route.params.subscribe(params => {
      if (params['claseDocumentoId']) {
        this.claseDocumentoId.set(params['claseDocumentoId']);
      }
      this.loadTemplates();
    });

    // Cargar catÃ¡logos iniciales
    this.loadAreas();
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
   * Carga catÃ¡logos dinÃ¡micos
   */
  async loadDynamicFieldsCatalogs() {
    // Ya no se usan plantillas internas
  }

  async loadInternalTemplatesList(clase: string, areaId: string) {
    try {
      const res = await this.internalTemplateService.getAll({
        tipo_documento: clase, area_id: areaId
      });
      this.internalTemplatesList.set(res.data || []);
      this.selectedInternalTemplateId.set(''); // reset selection
    } catch (e) {
      console.error('Error cargando plantillas internas:', e);
      this.internalTemplatesList.set([]);
    }
  }

  /**
   * Carga todas las Ã¡reas organizacionales
   */
  async loadAreas() {
    try {
      const res = await this._areaService.getAll();
      this.allAreas.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar catÃ¡logo de Ã¡reas:', err);
    }
    try {
      const res = await this._employeeService.getAll({ plain: true });
      this.allEmployees.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar catÃ¡logo de empleados:', err);
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
      console.error('Error al cargar catÃ¡logo de puestos:', err);
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
      // Si se selecciona un puesto especÃ­fico, quita "Todo el personal" si estuviera seleccionado
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
      console.error('Error al cargar catÃ¡logo de plantillas:', err);
    }
  }

  /**
   * Carga los datos del titular del Ã¡rea base activa
   */
  async loadDirectoRemitente() {
    const activeAds = this._session.activeAdscription();
    console.log('ðŸ” [DEBUG] activeAdscription from session:', activeAds);
    const areaBaseId = activeAds?.id_area_base || activeAds?.id_area;
    console.log('ðŸ” [DEBUG] resolved areaBaseId:', areaBaseId);
    if (!areaBaseId) return;

    try {
      const res = await this._adscriptionService.getByArea(areaBaseId);
      const adscriptions = res.data || [];
      console.log('ðŸ” [DEBUG] adscriptions resolved:', adscriptions);
      const head = adscriptions.find((a: any) => a.is_head || a.is_in_charge) || adscriptions[0];
      console.log('ðŸ” [DEBUG] selected head:', head);
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
   * Carga los datos del titular del Ã¡rea seleccionada (Bajo gestiÃ³n)
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
   * Carga los datos del destinatario al seleccionar un Ã¡rea interna (Memo / TI / Oficio Oficial)
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
      console.error('Error cargando destinatario de Ã¡rea:', err);
    }
  }

  /**
   * Actualiza el contacto externo seleccionado
   */
  onExternalContactSelect(contact: any | null) {
    if (contact) {
      this.idContactoExterno.set(contact.id);
      this.selectedExternalContact.set(contact);
    } else {
      this.idContactoExterno.set('');
      this.selectedExternalContact.set(null);
    }
  }

  isCcpEmployeesLoading = signal<boolean>(false);

  /**
   * Carga los empleados de un Ã¡rea para los selectores de C.C.P.
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
        // Asegurar que las Ã¡reas globales estÃ©n cargadas antes de procesar CCP
        if (this.allAreas().length === 0) {
          const res = await this._areaService.getAll();
          this.allAreas.set(res.data || []);
        }
        if (this.allEmployees().length === 0) {
          const res = await this._employeeService.getAll({ plain: true });
          this.allEmployees.set(res.data || []);
        }

        const draftRes = await this._documentService.getDraftAction(draftId, actionType);
        const draft = draftRes && draftRes.data !== undefined ? draftRes.data : draftRes;
        if (draft) {
          this.asunto.set(draft.asunto || '');
          this.cuerpo.set(draft.cuerpo || '');
          this.temas.set(draft.temas || '');
          
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
        alert('OcurriÃ³ un error al precargar el borrador del documento original.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // InicializaciÃ³n regular si no es respuesta/seguimiento
      if (this.claseDocumentoId() === 'circular') {
        this.destinatarioTextoLibre.set('Directores, Subsecretarios y Jefes de Departamento');
      }
    }
  }

  /**
   * Estandariza el nombre formateado de un Ã¡rea
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
   * Obtiene la descripciÃ³n formal del puesto con sensibilidad de gÃ©nero si aplica
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
   * EnvÃ­a el formulario para crear el documento en base de datos y generar Drive
   */
  async onSubmit() {
    const solicitanteId = this._session.currentUserData()?.id_empleado;
    if (!solicitanteId) {
      alert('SesiÃ³n invÃ¡lida. Debe estar autenticado.');
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
      id_area_emisora: this._session.activeAdscription()?.id_area || this.idAreaEmisora(),
      id_area_remitente: this.idAreaEmisora(),
      asunto: this.asunto().trim(),
      temas: this.temas().trim(),
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
        attachment_title: a.attachment_title,
        extension: a.extension
      }))
    };

    // Relaciones de seguimiento y respuestas se gestionan mediante endpoints especializados y UUIDs

    // ValidaciÃ³n y empaquetado del Destinatario segÃºn la clase
    const clase = this.claseDocumentoId();
    if (clase === 'memo' || clase === 'ti') {
      if (!this.idAreaReceptora()) {
        alert('Debe seleccionar el Ã¡rea destinataria.');
        return;
      }
      payload.id_area_receptora = this.idAreaReceptora();
      payload.id_destinatario_interno = this.idDestinatarioInterno();
    } 
    else if (clase === 'oficio') {
      if (this.tipoDestinatarioOficio() === 'oficial') {
        if (!this.idContactoExterno()) {
          alert('Debe seleccionar el contacto externo.');
          return;
        }
        payload.id_contacto_externo = this.idContactoExterno();
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

    // InyecciÃ³n de metadatos desnormalizados para optimizar lecturas del Inbox
    const metadatos: any = {};

    // 1. Solicitante (usuario logueado en sesiÃ³n)
    const user = this._session.currentUserData();
    const pers = user?.datos_personales;
    const ads = this._session.activeAdscription();
    if (pers) {
      const prefix = pers.prefix ? `${pers.prefix.trim()} ` : '';
      metadatos.solicitante_nombre = `${prefix}${pers.name || ''} ${pers.first_surname || ''} ${pers.second_surname || ''}`.replace(/\s+/g, ' ').trim();
      metadatos.solicitante_puesto = this.getResolvedJobPosition(ads, pers.sex);
      metadatos.solicitante_curp = pers.curp || '';
    }

    // 2. Remitente
    if (this.idRemitente()) {
      metadatos.remitente_nombre = this.remitenteNombre();
      metadatos.remitente_puesto = this.remitentePuesto();
      const remitenteObj = this.allEmployees().find(e => e.employee_id === this.idRemitente());
      if (remitenteObj) {
        metadatos.remitente_curp = remitenteObj.curp || '';
      }
    }

    // 3. Ãreas emisora y remitente
    if (this.idAreaEmisora()) {
      const emisoraObj = this.allAreas().find(a => a.id === this.idAreaEmisora());
      if (emisoraObj) {
        const desc = this.getAreaFormattedName(emisoraObj);
        metadatos.area_emisora_nombre = desc;
        metadatos.area_remitente_nombre = desc;
      }
    }

    // 4. Ãrea receptora y destinatario interno (Memos, Tarjetas Informativas u Oficio Oficial si aplica)
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
        const destObj = this.allEmployees().find(e => e.employee_id === this.idDestinatarioInterno());
        if (destObj) {
          metadatos.destinatario_curp = destObj.curp || '';
        }
      }
    }

    // 4.1. Circular: Nombres de los puestos a los que se les enviÃ³ la circular
    if (clase === 'circular') {
      const postsNames = this.circularDestinatariosPuestos().map(jp => 
        jp.id === 'ALL_EMPLOYES' ? 'Todo el personal' : (jp.name_plural || jp.name)
      );
      metadatos.destinatario_interno_nombre = postsNames.join(', ');
    }

    // 5. Destinatario Oficial Externo (Oficios con destinatario registrado)
    if (clase === 'oficio' && this.tipoDestinatarioOficio() === 'oficial') {
      const destOficial = this.selectedExternalContact();
      if (destOficial) {
        metadatos.destinatario_oficial_nombre = destOficial.nombre || destOficial.name || '';
        metadatos.destinatario_oficial_puesto = destOficial.puesto || destOficial.job_position || '';
        metadatos.destinatario_oficial_curp = destOficial.curp || '';
        metadatos.destinatario_oficial_dependencia = destOficial.empresa_dependencia || '';
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

      // Guardar el temas si es nuevo
      const newTema = this.temas().trim();
      const areaId = this.idAreaEmisora();
      if (newTema && areaId && !this.temasList().includes(newTema)) {
        try {
          await this._areaService.addTema(areaId, newTema);
        } catch (e) {
          console.warn('Failed to save new theme to area list:', e);
        }
      }

      this._router.navigate([`/operatividad/documento/${this.claseDocumentoId()}`], {
        queryParams: {
          tipo: this.tipoRemitente(),
          bandeja: '✏️ En edición'
        }
      });
    } catch (error: any) {
      console.error('Error al guardar documento:', error);
      alert(
        error?.error?.message || 
        error?.message || 
        'OcurriÃ³ un error al intentar crear el documento y clonarlo en Drive.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inserta una etiqueta en la posiciÃ³n actual del cursor dentro del cuerpo
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



  loadInternalTemplate(templateId: string) {
    this.selectedInternalTemplateId.set(templateId);
    if (!templateId) return;
    const temp = this.internalTemplatesList().find(t => t.id === templateId);
    if (temp) {
      this.cuerpo.set(temp.content || '');
    }
  }

  /**
   * (Deprecado) Guarda el cuerpo actual como plantilla interna
   */
  async saveAsInternalTemplate() {
    if (!this.newTemplateName().trim()) return;
    this.isSavingTemplate.set(true);
    try {
      const templateData = {
        name: this.newTemplateName(),
        content: this.cuerpo() || '',
        document_class: this.claseDocumentoId(),
        area_id: this._session.activeAdscription()?.id_area,
        active: true
      };
      
      await this.internalTemplateService.create(templateData);
      
      this.showSaveTemplatePopover.set(false);
      this.newTemplateName.set('');
    } catch (e) {
      console.error('Failed to save template', e);
    } finally {
      this.isSavingTemplate.set(false);
    }
  }

  onUseTemplate(tpl: any) {
    this.cuerpo.set(tpl.content || '');
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
      alert('No se pudo determinar el Ã¡rea activa.');
      return;
    }
    if (this.activeAreaCustomFields().includes(fieldName)) {
      alert('Este campo ya estÃ¡ registrado.');
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

