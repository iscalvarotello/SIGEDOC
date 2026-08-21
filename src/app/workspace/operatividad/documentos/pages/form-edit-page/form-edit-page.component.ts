import { Component, OnInit, inject, signal, computed, effect, input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ListboxOption } from '@system-shared/form/listbox/base-listbox.directive';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule                  } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DocumentService              } from '../../services/document.service';
import { AreaService } from '@organization/areas/area.service';
import { AreaDTO } from '@organization/areas/area.dto';
import { InternalTemplatesService, InternalTemplateDTO } from '@database/templates/internal-templates.service';
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
import { ProjectSelectComponent       } from '@workspace-shared/components/selects/project-select/project-select.component';
import { PartidaSelectComponent       } from '@workspace-shared/components/selects/partida-select/partida-select.component';
import { SupplierSelectComponent      } from '@workspace-shared/components/selects/supplier-select/supplier-select.component';
import { CarSelectComponent           } from '@workspace-shared/components/selects/car-select/car-select.component';
import { DocumentTypeSelectComponent  } from '@workspace-shared/components/selects/document-type-select/document-type-select.component';
import { DocumentAttachmentsComponent } from '@workspace-shared/components/media/document-attachments/document-attachments.component';
import { DatePickerComponent          } from '@system-shared/form/date-picker/date-picker.component';
import { SubmitButtonComponent        } from '@system-shared/buttons/submit-button/submit-button.component';
import { InputFieldComponent            } from '@system-shared/form/input/input-field.component';
import { TextAreaComponent              } from '@system-shared/form/input/text-area.component';
import { CcpFormPanelComponent          } from '../../components/ccp-form-panel/ccp-form-panel.component';
import { CancelButtonComponent        } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { LocalRouteService            } from '@core/routing/local-route.service';
import { LocalRoutePipe               } from '@core/routing/local-route.pipe';
import { LOCAL_ROUTE_KEYS             } from '@core/routing/local-routes.config';
import { ExternalContactSelectComponent } from '@workspace-shared/components/selects/external-contact-select/external-contact-select.component';

import { TopicComponent } from '@system-shared/form/topic/topic.component';
import { VirtualPaperModalComponent } from '../../components/virtual-paper-modal/virtual-paper-modal.component';
import { DocumentEditorPanelComponent } from '../../components/document-editor-panel/document-editor-panel.component';
import { HtmlViewerComponent } from '@metasystem/components/media/html-viewer/html-viewer.component';
import { DocumentLocalRendererService } from '../../services/document-local-renderer.service';

@Component({
  selector: 'app-form-edit-page',
  standalone: true,
  imports: [
    InputFieldComponent,
    TextAreaComponent,
    CcpFormPanelComponent, CommonModule, FormsModule, ClaseDocumentPipe, PageBreadcrumbComponent, AreaSelectComponent, DocumentTypeSelectComponent, DocumentAttachmentsComponent, DatePickerComponent, SubmitButtonComponent, CancelButtonComponent,
    JobPositionSelectComponent, ExternalContactSelectComponent, IconComponent, ActionButtonComponent, TopicComponent, VirtualPaperModalComponent,
    DocumentEditorPanelComponent, HtmlViewerComponent
  ],
  templateUrl: './form-edit-page.component.html',
})
export class FormEditPageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _location = inject(Location);
  protected _session = inject(SesionService);
    private _documentService = inject(DocumentService);
  private _localRenderer = inject(DocumentLocalRendererService);
  private _sanitizer = inject(DomSanitizer);

  showPreviewModal = signal<boolean>(false);
  previewHtmlString = signal<SafeHtml | null>(null);
  previewHtmlUrl = signal<any | null>(null);
  private _areaService = inject(AreaService);
  private _adscriptionService = inject(AdscriptionService);
  private _templateService = inject(DocumentTemplateService);
  private _employeeService = inject(EmployeeService);
  private _genericService = inject(GenericApiService);
  protected _localRoute = inject(LocalRouteService);
  protected ROUTES = LOCAL_ROUTE_KEYS;

  claseDocumentoId = signal<any>('memo');
  editingDocumentId = signal<string | null>(null);
  numeroDocumento = signal<string>('');
  isRecreating = signal<boolean>(false);

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
  isRestricted = signal<boolean>(false);

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

  // Proveedor
  customContractNumber = signal<string>('');
  customLicitacionNumber = signal<string>('');

  // Evento
  customEventDate = signal<string>('');
  customEventCost = signal<string>('');

  // General / Fechas
  customStartDate = signal<string>('');
  customEndDate = signal<string>('');

  // Campos libres de la pestaña 'libre'
  customEventName = signal<string>('');
  customEventPlace = signal<string>('');
  customInvoice = signal<string>('');
  customMonto = signal<string>('');
  customFecha = signal<string>(new Date().toISOString().substring(0, 10));

  private internalTemplateService = inject(InternalTemplatesService);

  // Pestaña activa del panel lateral
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

  // Diccionario del documento (alimentado desde app-document-editor-panel)
  bodyDictionary = signal<Record<string, string>>({});

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
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();
    
    // Mismo mes y año
    if (month1 === month2 && year1 === year2) {
      if (year1 === currentYear) {
         return `${day1} al ${day2} de ${month1} del presente`;
      }
      return `${day1} al ${day2} de ${month1} de ${year1}`;
    }
    
    // Diferente mes pero mismo año
    if (year1 === year2) {
      if (year1 === currentYear) {
         return `${day1} de ${month1} al ${day2} de ${month2} del presente`;
      }
      return `${day1} de ${month1} al ${day2} de ${month2} de ${year1}`;
    }
    
    // Diferentes años
    return `${day1} de ${month1} de ${year1} al ${day2} de ${month2} de ${year2}`;
  }

  /**
   * Reemplaza permanentemente las etiquetas en el editor con sus valores actuales
   */
  replaceTagsInBody() {
    // Moved to DocumentEditorPanelComponent, HtmlViewerComponent
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

    // PREVIEW LOCAL
  async openPreviewModal() {
    this.isLoading.set(true);
    try {
      if (this.editingDocumentId()) {
        const blob = await this._documentService.downloadEmergencyHtml(this.editingDocumentId()!);
        const fileURL = URL.createObjectURL(blob);
        this.previewHtmlString.set(null);
        this.previewHtmlUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
      } else {
        this.previewHtmlUrl.set(null);
        this.renderLocalPreview();
      }
      this.showPreviewModal.set(true);
    } catch (e) {
      console.error(e);
      alert('No se pudo obtener la plantilla del servidor. Verificando vista previa local.');
      this.previewHtmlUrl.set(null);
      this.renderLocalPreview();
      this.showPreviewModal.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  
  getFullDictionary() {
    return {
      ...this.bodyDictionary(),
      'BODY': this.cuerpo() // The HTML wrapper might have {{BODY}}!
    };
  }


  renderLocalPreview() {
    const rawHtml = this.cuerpo();
    const rendered = this._localRenderer.renderLocalHtml(rawHtml, {
      attachments: this.anexos(),
      ccps: this.ccps(),
      showQrMock: true
    });
    this.previewHtmlString.set(this._sanitizer.bypassSecurityTrustHtml(rendered));
  }

  cancel() {
    if (window.history.length > 1) {
      this._location.back();
    } else {
      this._router.navigate([`/operatividad/documento/${this.claseDocumentoId()}`]);
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
    this._route.queryParams.subscribe(q => {
      this.isRecreating.set(q['recreate'] === 'true');
    });

    this._route.params.subscribe(params => {
      if (params['id']) {
        this.editingDocumentId.set(params['id']);
        this.loadDocumentForEditing(params['id']);
      }
      if (params['claseDocumentoId']) {
        this.claseDocumentoId.set(params['claseDocumentoId']);
      }
      this.loadTemplates();
    });

    // Cargar catálogos iniciales
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

  async loadDocumentForEditing(id: string) {
    this.isLoading.set(true);
    try {
      const doc = await this._documentService.getById(id) as any;
      
      // Mapear clase de documento
      if (doc.clase_documento?.id) {
        this.claseDocumentoId.set(doc.clase_documento.id);
        this.loadTemplates();
      }

      // Mapear campos básicos
      this.asunto.set(doc.asunto || '');
      this.temas.set(doc.temas || '');
      this.cuerpo.set(doc.cuerpo || '');
      this.bodyDictionary.set(doc.body_dictionary || {});
      this.isRestricted.set(doc.is_restricted || false);
      
      if (doc.fecha_documento) {
        this.fechaDocumento.set(doc.fecha_documento.split('T')[0]);
      }

      if (doc.num_doc) {
        this.numeroDocumento.set(doc.num_doc);
      }

      // Mapear remitente
      if (doc.id_area_remitente) {
        this.idAreaEmisora.set(doc.id_area_remitente);
      }
      
      // Mapear destinatario principal
      if (doc.area_receptora) {
        this.tipoDestinatarioOficio.set('oficial');
        await this.onDestinatarioAreaChange(doc.area_receptora.id, doc.destinatario_interno?.id || doc.destinatario_interno?.employee_id);
      } else if (doc.destinatario_oficial) {
        this.tipoDestinatarioOficio.set('oficial');
        this.onExternalContactSelect(doc.destinatario_oficial);
      } else if (doc.destinatario_texto_libre) {
        this.tipoDestinatarioOficio.set('libre');
        this.destinatarioTextoLibre.set(doc.destinatario_texto_libre);
      }
      
      // Mapear ccps
      if (doc.ccps && doc.ccps.length > 0) {
        this.ccps.set(doc.ccps.map((c: any) => ({
          id_area: c.area?.id || '',
          id_empleado: c.empleado?.id || c.empleado?.employee_id || '',
          nombre_area: c.area?.nombre || c.area?.name || '',
          nombre_empleado: c.empleado?.person ? `${c.empleado.person.name || ''} ${c.empleado.person.first_surname || ''} ${c.empleado.person.second_surname || ''}`.trim() : ''
        })));
      }
      
      // Mapear anexos
      if (doc.anexos) {
        this.anexos.set(doc.anexos);
      }
      
    } catch (e) {
      console.error('Error al cargar el documento', e);
      alert('Error al cargar el documento para edición');
    } finally {
      this.isLoading.set(false);
    }
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

  showVirtualPaper = signal<boolean>(false);

  virtualPaperMetadata = computed(() => {
    return {
      numero: 'BORRADOR',
      asunto: this.asunto(),
      fecha: this.formatProjectDate(this.fechaDocumento(), 'full'),
      lugar: 'Tuxtla Gutiérrez, Chiapas',
      destinatario_nombre: this.destinatarioNombre() || this.destinatarioTextoLibre(),
      destinatario_puesto: this.destinatarioPuesto(),
      remitente_nombre: this.remitenteNombre(),
      remitente_puesto: this.remitentePuesto(),
      area_nombre: this.allAreas().find(a => a.id_area === this.idAreaEmisora())?.nombre_area || ''
    };
  });

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
      is_restricted: this.isRestricted(),
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
    
    console.log('[FRONTEND DEBUG] HTML cuerpo al guardar:', payload.cuerpo);

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
      const docId = this.editingDocumentId();
      if (docId) {
        await this._documentService.update(docId, payload);
        if (this.isRecreating()) {
          await this._documentService.renderGoogleDoc(docId, true);
        }
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


  async handleSyncFromDrive() {
    const docId = this.editingDocumentId();
    if (!docId) return;

    try {
      this.isLoading.set(true);
      const res = await this._documentService.syncTextFromDrive(docId) as any;
      const responseData = res && res.data !== undefined ? res.data : res;
      if (responseData && responseData.text) {
        this.cuerpo.set(responseData.text);
        alert('Texto sincronizado desde Google Drive exitosamente. No olvides guardar.');
      }
    } catch (e: any) {
      console.error(e);
      alert('Error sincronizando texto: ' + (e.error?.message || e.message || 'Error desconocido'));
    } finally {
      this.isLoading.set(false);
    }
  }
  async addCustomFieldPanel(fieldName: string) {
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
      await this.loadAreas();
    } catch (err) {
      console.error('Error al registrar campo personalizado:', err);
      alert('Error al registrar el campo.');
    }
  }
}















