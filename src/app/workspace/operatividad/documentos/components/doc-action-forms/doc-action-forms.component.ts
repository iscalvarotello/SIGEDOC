import { Component, Input, Output, EventEmitter, inject, signal, computed, effect, model, OnInit } from '@angular/core';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { SubmitButtonComponent } from '@system-shared/buttons/submit-button/submit-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { SesionService } from '@services/sesion.service';
import { EmployeeService } from '@rh/employees/employee.service';
import { AreaService } from '@organization/areas/area.service';
import { AreaDTO } from '@organization/areas/area.dto';
import { AdscriptionService } from '@rh/adscriptions/adscription.service';
import { DocumentAttachmentsComponent } from '@workspace-shared/components/media/document-attachments/document-attachments.component';
import { AreaSelectComponent } from '@workspace-shared/components/selects/area-select/area-select.component';
import { EmployeeSelectComponent } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { FileUploaderComponent } from '@system-shared/media/file-uploader/file-uploader.component';
import { ClaseDocumentoId } from '../../interfaces/document.interface';
import { CCP_PHRASES } from '@core/config/app.ccp-phrases.config';
import { GovSignatureModalComponent } from '@workspace-shared/components/gov-signature-modal/gov-signature-modal.component';
import { copyToClipboard } from '@core/utils/clipboard.util';

@Component({
  selector: 'doc-action-forms',
  standalone: true,
  imports: [ActionButtonComponent, CancelButtonComponent, SubmitButtonComponent, IconComponent, 
    CommonModule,
    FormsModule,
    DocumentAttachmentsComponent,
    AreaSelectComponent,
    EmployeeSelectComponent,
    FileUploaderComponent,
    GovSignatureModalComponent],
  templateUrl: './doc-action-forms.component.html',
})
export class DocActionFormsComponent implements OnInit {
  @Input() doc: any | null = null;
  @Input() selectedTipo: 'directo' | 'gestionado' | 'recibido_externo' = 'directo';
  @Input() claseDocumentoId: ClaseDocumentoId = 'memo';

  // Two-way bindings
  activeActionForm = model<string | null>(null);
  wordPdfFile = signal<File | null>(null);
  selectedDocAttachments = model<any[]>([]);

  @Output() actionCompleted = new EventEmitter<void>();

  // Inyección de Servicios
  private _documentService = inject(DocumentService);
  private _session = inject(SesionService);
  private _employeeService = inject(EmployeeService);
  private _areaService = inject(AreaService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _adscriptionService = inject(AdscriptionService);

  ccpPhrases = CCP_PHRASES;

  // Estados locales de formularios de acción
  actionComments = signal<string>('');
  actionInstruction = signal<string>('');
  actionRevisorId = signal<string>('');
  actionTurnadoAId = signal<string>('');
  actionAreaAtencionId = signal<string>('');
  actionDestinatarioAtencionId = signal<string>('');
  actionMedioEnvio = signal<string>('directo');
  isActionLoading = signal<boolean>(false);
  actionSuccess = signal<string | null>(null);
  actionError = signal<string | null>(null);

  // Catálogos locales
  allAreas = signal<any[]>([]);
  possibleReviewers = signal<any[]>([]);
  isPossibleReviewersLoading = signal<boolean>(false);
  revisorAreaId = signal<string>('');
  revisorEmployeesList = signal<any[]>([]);
  isRevisorEmployeesLoading = signal<boolean>(false);
  turnarEmployeesList = signal<any[]>([]);
  isTurnarEmployeesLoading = signal<boolean>(false);
  ccpAreaId = signal<string>('');
  ccpEmployeeId = signal<string>('');
  ccpEmployeesList = signal<any[]>([]);
  isCcpEmployeesLoading = signal<boolean>(false);
  selectedCcpPhrase = signal<string>(CCP_PHRASES[0]);
  customCcpPhrase = signal<string>('');
  nuevosAnexos = signal<any[]>([]);

  selectedRevisorObj = signal<any | null>(null);
  selectedTurnadoObj = signal<any | null>(null);

  // Acciones de Subir acuse
  acuseAreaId = signal<string>('');
  acuseReceptionistId = signal<string>('');
  acuseReceptionistsList = signal<any[]>([]);
  isAcuseReceptionistsLoading = signal<boolean>(false);
  acuseFile = signal<File | null>(null);
  acuseFileName = signal<string>('');

  copiedNewCcpText = signal<string | null>(null);

  isSignatureModalOpen = signal<boolean>(false);
  currentUserCurp = computed(() => this._session.currentUserData()?.datos_personales?.curp || '');
  currentUserIdEmpleado = computed(() => this._session.currentUserData()?.id_empleado || '');

  // Copia automática de CCP
  ccpCopyPasteText = computed<string>(() => {
    const areaId = this.ccpAreaId();
    const empId = this.ccpEmployeeId();
    if (!empId) return '';

    const area = this.allAreas().find(a => a.id === areaId);
    const employee = this.ccpEmployeesList().find(
      e => e.employee_id === empId || e.id_employee === empId || e.id === empId
    );
    if (!employee) return '';

    const prefix = employee.prefix || employee.prefijo || '';
    const name = employee.fullname || employee.nombre_completo || 
      `${employee.name || ''} ${employee.first_lastname || ''} ${employee.second_lastname || ''}`.trim();
    const job = employee.job_name || employee.job_position || employee.puesto || '';
    const areaAcronym = area?.acronym || area?.name || '';

    const prefixStr = prefix ? `${prefix.trim()} ` : '';
    const jobStr = job ? ` - ${job.trim()}` : '';
    const areaStr = areaAcronym ? ` - ${areaAcronym.trim()}` : '';

    return `C.c.p. ${prefixStr}${name}${jobStr}${areaStr}`;
  });

  constructor() {
    // Escuchar el cambio del formulario activo para inicializar datos
    effect(() => {
      const action = this.activeActionForm();
      const doc = this.doc;
      if (action && doc) {
        this.initializeForm(action, doc);
      }
    });
  }

  ngOnInit() {
    this._areaService.getAll().then(res => {
      this.allAreas.set(res.data || []);
    }).catch(err => console.error('Error al cargar áreas para derivación en el visualizador:', err));
  }

  initializeForm(action: string, doc: any) {
    this.closeActionFormState();
    if (doc && doc.comentarios && action !== 'ccp' && action !== 'anexos' && action !== 'subir_acuse') {
      this.actionComments.set(doc.comentarios);
    }
    if (action === 'solicitar_revision') {
      this.loadPossibleReviewers(doc.id);
    }
    if (action === 'solicitar_revision_terceros') {
      const activeArea = this._session.activeAdscription()?.id_area || '';
      if (activeArea) {
        this.onRevisorAreaChange(activeArea);
      }
    }
    if (action === 'turnar') {
      const activeArea = this._session.activeAdscription()?.id_area || '';
      this.onTurnarAreaChange(activeArea);
    }
    if (action === 'subir_acuse') {
      const defaultArea = doc?.id_area_receptora ? String(doc.id_area_receptora) : '';
      this.acuseAreaId.set(defaultArea);
      this.acuseFile.set(null);
      this.acuseFileName.set('');
      if (defaultArea) {
        this.loadAcuseReceptionists(defaultArea);
      }
    }
    if (action === 'despachar' && doc?.metodo_firma === 'autografa') {
      this.actionMedioEnvio.set('directo');
    }
  }

  closeActionFormState() {
    this.actionComments.set('');
    this.actionInstruction.set('');
    this.actionRevisorId.set('');
    this.actionTurnadoAId.set('');
    this.actionAreaAtencionId.set('');
    this.actionDestinatarioAtencionId.set('');
    this.actionMedioEnvio.set('sistema');
    this.ccpAreaId.set('');
    this.ccpEmployeeId.set('');
    this.customCcpPhrase.set('');
    this.selectedCcpPhrase.set(CCP_PHRASES[0]);
    this.actionError.set(null);
    this.actionSuccess.set(null);
    this.revisorAreaId.set('');
    this.nuevosAnexos.set([]);
    this.acuseAreaId.set('');
    this.acuseReceptionistId.set('');
    this.acuseReceptionistsList.set([]);
    this.isAcuseReceptionistsLoading.set(false);
    this.acuseFile.set(null);
    this.acuseFileName.set('');
  }

  closeActionForm() {
    this.activeActionForm.set(null);
    this.closeActionFormState();
  }

  formatActionName(action: string | null): string {
    if (!action) return '';
    return action.replace(/_/g, ' ');
  }

  async loadPossibleReviewers(docId: string) {
    if (!docId) return;
    this.isPossibleReviewersLoading.set(true);
    this.possibleReviewers.set([]);
    this.actionRevisorId.set('');
    try {
      const res = await this._documentService.getPossibleReviewers(docId);
      this.possibleReviewers.set(res || []);
      if (res && res.length > 0) {
        this.actionRevisorId.set(res[0].employee_id || res[0].id || '');
      }
    } catch (err) {
      console.error('Error al cargar posibles revisores:', err);
    } finally {
      this.isPossibleReviewersLoading.set(false);
    }
  }

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
      console.error('Error al cargar empleados para CCP:', err);
    } finally {
      this.isCcpEmployeesLoading.set(false);
    }
  }

  async onTurnarAreaChange(area: AreaDTO | string, forceRefresh = false) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.actionAreaAtencionId.set(areaId);
    this.actionTurnadoAId.set('');
    if (!areaId) {
      this.turnarEmployeesList.set([]);
      return;
    }
    this.isTurnarEmployeesLoading.set(true);
    try {
      const res = await this._employeeService.getByArea(areaId, forceRefresh);
      this.turnarEmployeesList.set(res.data || []);
      if (res.data && res.data.length > 0) {
        const firstEmp = res.data[0];
        this.actionTurnadoAId.set(firstEmp.employee_id || firstEmp.id);
      }
    } catch (err) {
      console.error('Error al cargar empleados para Turnar:', err);
    } finally {
      this.isTurnarEmployeesLoading.set(false);
    }
  }

  async onRevisorAreaChange(area: AreaDTO | string, forceRefresh = false) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.revisorAreaId.set(areaId);
    this.actionRevisorId.set('');
    if (!areaId) {
      this.revisorEmployeesList.set([]);
      return;
    }
    this.isRevisorEmployeesLoading.set(true);
    try {
      const res = await this._employeeService.getByArea(areaId, forceRefresh);
      const rawEmployees = res.data || [];
      const reviewers = rawEmployees.filter((e: any) => e.is_reviewer);
      this.revisorEmployeesList.set(reviewers);
      if (reviewers.length > 0) {
        const firstRevisor = reviewers[0] as any;
        this.actionRevisorId.set(firstRevisor.employee_id || firstRevisor.id || firstRevisor.id_employee || '');
      }
    } catch (err) {
      console.error('Error al cargar revisores:', err);
      this.revisorEmployeesList.set([]);
    } finally {
      this.isRevisorEmployeesLoading.set(false);
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

  onRevisorSelect(emp: any) {
    if (emp) {
      this.actionRevisorId.set(emp.employee_id || emp.id_employee || emp.id || '');
      this.selectedRevisorObj.set(emp);
    }
  }

  onRevisorClear() {
    this.actionRevisorId.set('');
    this.selectedRevisorObj.set(null);
  }

  onTurnadoSelect(emp: any) {
    if (emp) {
      this.actionTurnadoAId.set(emp.employee_id || emp.id_employee || emp.id || '');
      this.selectedTurnadoObj.set(emp);
    }
  }

  onTurnadoClear() {
    this.actionTurnadoAId.set('');
    this.selectedTurnadoObj.set(null);
  }

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

  getEmployeeFullName(emp: any): string {
    if (!emp) return '';
    const name = emp.name || '';
    const first = emp.first_surname || '';
    const second = emp.second_surname || '';
    const built = `${name} ${first} ${second}`.replace(/\s+/g, ' ').trim();
    return built || emp.fullName || '';
  }

  getEmployeeFullJobPosition(emp: any): string {
    if (!emp) return 'Colaborador';
    let puesto = '';
    const sex = emp.sex || '';
    
    if (emp.job_position) {
      if (typeof emp.job_position === 'object') {
        puesto = (sex === 'F' && emp.job_position.name_fem) 
          ? emp.job_position.name_fem 
          : (emp.job_position.name || 'Colaborador');
      } else {
        puesto = (sex === 'F' && emp.job_position_fem) ? emp.job_position_fem : emp.job_position;
      }
    } else if (emp.job_name) {
      puesto = emp.job_name;
    } else if (emp.resolvedJobPosition) {
      puesto = emp.resolvedJobPosition;
    }

    if (!puesto) {
      puesto = emp.area_type_name || 'Colaborador';
    }

    const area = emp.area || emp.area_name || '';
    if (puesto && area) {
      const lowerArea = area.toLowerCase().trim();
      let connector = 'en';
      if (lowerArea.startsWith('unidad') || 
          lowerArea.startsWith('dirección') || 
          lowerArea.startsWith('direccion') || 
          lowerArea.startsWith('subsecretaría') || 
          lowerArea.startsWith('subsecretaria') || 
          lowerArea.startsWith('coordinación') || 
          lowerArea.startsWith('coordinacion') || 
          lowerArea.startsWith('secretaría') || 
          lowerArea.startsWith('secretaria') || 
          lowerArea.startsWith('jefatura')) {
        connector = 'en la';
      } else if (lowerArea.startsWith('departamento')) {
        connector = 'en el';
      }
      return `${puesto} ${connector} ${area}`;
    }
    return puesto || area || 'Colaborador';
  }

  async loadAcuseReceptionists(areaId: string) {
    if (!areaId) {
      this.acuseReceptionistsList.set([]);
      this.acuseReceptionistId.set('');
      return;
    }
    this.isAcuseReceptionistsLoading.set(true);
    try {
      const res = await this._adscriptionService.getReceptionists(areaId);
      const receptionists = res.data || [];
      this.acuseReceptionistsList.set(receptionists);
      if (receptionists.length > 0) {
        const firstRecep = receptionists[0];
        this.acuseReceptionistId.set(firstRecep.employee_id || firstRecep.id || '');
      } else {
        this.acuseReceptionistId.set('');
      }
    } catch (err) {
      console.error('Error al cargar recepcionistas para acuse:', err);
      this.acuseReceptionistsList.set([]);
      this.acuseReceptionistId.set('');
    } finally {
      this.isAcuseReceptionistsLoading.set(false);
    }
  }

  onAcuseAreaChange(area: AreaDTO | string) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.acuseAreaId.set(areaId);
    this.loadAcuseReceptionists(areaId);
  }

  onAcuseReceptionistSelect(emp: any) {
    if (emp) {
      this.acuseReceptionistId.set(emp.employee_id || emp.id || '');
    }
  }

  onAcuseReceptionistClear() {
    this.acuseReceptionistId.set('');
  }

  onAcuseFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo supera el límite de 10MB');
      event.target.value = '';
      return;
    }

    this.acuseFile.set(file);
    this.acuseFileName.set(file.name);
    
    // Clear input value to allow selecting same file again
    event.target.value = '';
  }

  removeAcuseFile() {
    this.acuseFile.set(null);
    this.acuseFileName.set('');
  }

  copyNewCcpToClipboard(text: string) {
    if (!text) return;
    copyToClipboard(text).then((success: boolean) => {
      if (success) {
        this.copiedNewCcpText.set(text);
        setTimeout(() => {
          if (this.copiedNewCcpText() === text) {
            this.copiedNewCcpText.set(null);
          }
        }, 2000);
      }
    });
  }

  async submitCcp() {
    const doc = this.doc;
    if (!doc) return;

    if (!this.ccpAreaId() || !this.ccpEmployeeId()) {
      this.actionError.set('Debe seleccionar área y empleado para el C.C.P.');
      return;
    }

    this.isActionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    const motivoText = this.selectedCcpPhrase() === 'Otro' ? this.customCcpPhrase().trim() : this.selectedCcpPhrase();
    const payload = {
      id_area: this.ccpAreaId(),
      id_empleado: this.ccpEmployeeId(),
      motivo: motivoText || 'Para su conocimiento',
    };

    try {
      await this._documentService.addCcp(doc.id, payload);
      this.actionSuccess.set('C.C.P. agregado correctamente.');
      setTimeout(async () => {
        this.closeActionForm();
        this.actionCompleted.emit();
      }, 1500);
    } catch (error: any) {
      console.error('Error al agregar C.C.P.:', error);
      this.actionError.set(
        error?.error?.message || 
        error?.message || 
        'Ocurrió un error al intentar agregar el C.C.P. al documento.'
      );
    } finally {
      this.isActionLoading.set(false);
    }
  }

  async submitAnexos() {
    const doc = this.doc;
    if (!doc) return;

    this.isActionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    const currentAttachments = this.selectedDocAttachments();

    try {
      let updatedAttachments = [...currentAttachments];
      const toAdd = this.nuevosAnexos();
      
      if (toAdd.length === 0) {
        this.actionError.set('Debe seleccionar al menos un anexo.');
        this.isActionLoading.set(false);
        return;
      }

      for (const att of toAdd) {
        if (!updatedAttachments.some(item => item.id_attachment === att.id_attachment)) {
          updatedAttachments.push({
            id_attachment: att.id_attachment,
            attachment_name: att.attachment_name,
            attachment_title: att.attachment_title,
            extension: att.extension,
          });
        }
      }

      await this._documentService.updateAttachments(doc.id, updatedAttachments);
      this.actionSuccess.set('Anexos agregados con éxito.');
      this.nuevosAnexos.set([]);
      this.selectedDocAttachments.set(updatedAttachments);

      setTimeout(async () => {
        this.closeActionForm();
        this.actionCompleted.emit();
      }, 1500);

    } catch (error: any) {
      console.error('Error al agregar anexos:', error);
      this.actionError.set(
        error?.error?.message || 
        error?.message || 
        'Ocurrió un error al guardar los anexos.'
      );
    } finally {
      this.isActionLoading.set(false);
    }
  }

  
  async submitAction(actionType: string) {
    if (actionType === 'upload_word_pdf') {
      const file = this.wordPdfFile();
      if (!file) {
        this.actionError.set('Debe seleccionar un archivo PDF.');
        return;
      }
      try {
        this.isActionLoading.set(true);
        this.actionSuccess.set('PDF subido exitosamente.');
        setTimeout(() => { this.closeActionForm(); this.actionCompleted.emit(); }, 1500);
      } catch (e: any) {
        this.actionError.set(e?.error?.message || 'Error al subir PDF');
      } finally {
        this.isActionLoading.set(false);
      }
      return;
    }
    const doc = this.doc;
    if (!doc) return;

    this.isActionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    let payloadAction = actionType;
    if (actionType === 'rechazar' && doc.bandeja === '📋 Para revisión') {
      payloadAction = 'devolver_correcciones';
    }

    if (payloadAction === 'firmar_y_despachar') {
      this.isActionLoading.set(false);
      this.isSignatureModalOpen.set(true);
      return;
    }

    const payload: any = { action: payloadAction };

    if (payloadAction === 'subir_acuse') {
      const file = this.acuseFile();
      if (!file) {
        this.actionError.set('Debe seleccionar un archivo PDF para el acuse.');
        this.isActionLoading.set(false);
        return;
      }
      if (!this.acuseAreaId()) {
        this.actionError.set('Debe seleccionar un área.');
        this.isActionLoading.set(false);
        return;
      }
      if (!this.acuseReceptionistId()) {
        this.actionError.set('Debe seleccionar un recepcionista.');
        this.isActionLoading.set(false);
        return;
      }

      try {
        await this._documentService.uploadPhysicalAcuse(doc.id, file, this.acuseReceptionistId());
        this.actionSuccess.set('Acuse físico subido con éxito.');
        setTimeout(async () => {
          this.closeActionForm();
          this.actionCompleted.emit();
        }, 1500);
      } catch (error: any) {
        console.error('Error al subir acuse físico:', error);
        this.actionError.set(
          error?.error?.message || 
          error?.message || 
          'Ocurrió un error inesperado al subir el acuse físico.'
        );
      } finally {
        this.isActionLoading.set(false);
      }
      return;
    }

    if (payloadAction === 'solicitar_revision') {
      if (!this.actionRevisorId()) {
        this.actionError.set('Debe seleccionar un revisor.');
        this.isActionLoading.set(false);
        return;
      }
      payload.id_revisor = this.actionRevisorId();
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    } 
    else if (payloadAction === 'devolver_correcciones') {
      if (!this.actionComments().trim()) {
        this.actionError.set('Debe escribir comentarios para las correcciones.');
        this.isActionLoading.set(false);
        return;
      }
      payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'rechazar') {
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'autorizar') {
      payload.comentarios = this.actionComments().trim() || null;
    }
    else if (payloadAction === 'revisar') {
      payload.comentarios = this.actionComments().trim() || null;
    }
    else if (payloadAction === 'cancelar') {
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'despachar') {
      payload.medio_envio = this.actionMedioEnvio();
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'recibir') {
      const currentEmployeeId = this._session.currentUserData()?.id_empleado;
      if (!currentEmployeeId) {
        this.actionError.set('Debe especificar quién recibe.');
        this.isActionLoading.set(false);
        return;
      }
      payload.id_recibe = currentEmployeeId;
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'turnar') {
      if (!this.actionTurnadoAId()) {
        this.actionError.set('Debe seleccionar a quién turnar.');
        this.isActionLoading.set(false);
        return;
      }
      payload.id_turnado_a = this.actionTurnadoAId();
      if (this.actionAreaAtencionId()) payload.id_area_atencion = this.actionAreaAtencionId();
      if (this.actionDestinatarioAtencionId()) payload.id_destinatario_atencion = this.actionDestinatarioAtencionId();
      if (this.actionInstruction().trim()) payload.instruccion = this.actionInstruction().trim();
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }
    else if (payloadAction === 'atender') {
      if (this.actionComments().trim()) payload.comentarios = this.actionComments().trim();
    }

    // Metadatos desnormalizados
    const metadatos: any = {};
    if (payloadAction === 'solicitar_revision') {
      let revObj = this.selectedRevisorObj();
      if (!revObj && this.actionRevisorId()) {
        const searchList = [...this.possibleReviewers(), ...this.revisorEmployeesList()];
        revObj = searchList.find(r => (r.employee_id || r.id || r.id_employee) === this.actionRevisorId());
      }
      if (revObj) {
        metadatos.revisor_nombre = this.getEmployeeFullName(revObj);
        metadatos.revisor_puesto = this.getEmployeeFullJobPosition(revObj);
      }
    } 
    else if (payloadAction === 'turnar') {
      let turnObj = this.selectedTurnadoObj();
      if (!turnObj && this.actionTurnadoAId()) {
        turnObj = this.turnarEmployeesList().find(t => (t.employee_id || t.id || t.id_employee) === this.actionTurnadoAId());
      }
      if (turnObj) {
        metadatos.turnado_a_nombre = this.getEmployeeFullName(turnObj);
        metadatos.turnado_a_puesto = this.getEmployeeFullJobPosition(turnObj);
      }
      if (this.actionAreaAtencionId()) {
        const areaObj = this.allAreas().find(a => a.id === this.actionAreaAtencionId());
        if (areaObj) {
          metadatos.area_atencion_nombre = this.getAreaFormattedName(areaObj);
        }
      }
    }

    if (Object.keys(metadatos).length > 0) {
      payload.metadatos_desnormalizados = metadatos;
    }

    // Metadatos de notificación automática
    const classNames: Record<string, string> = {
      memo: 'Memorándum',
      oficio: 'Oficio',
      ti: 'TI',
      circular: 'Circular',
    };
    const resolvedDocClass = classNames[doc.clase_documento] || 'Documento';
    const docNum = doc.num_doc || 'sin folio';

    const user     = this._session.currentUserData();
    const pers     = user?.datos_personales;
    const ads      = this._session.activeAdscription();
    const prefix   = pers?.prefix ? `${pers.prefix.trim()} ` : '';
    const name     = pers?.name || '';
    const first    = pers?.first_surname || '';
    const second   = pers?.second_surname || '';
    const fullName = `${prefix}${name} ${first} ${second}`.replace(/\s+/g, ' ').trim();

    let job = 'Colaborador';
    if (ads) {
      if (ads.job_position) {
        const sex = pers?.sex || '';
        job = (sex === 'F' && ads.job_position.name_fem) 
          ? ads.job_position.name_fem 
          : (ads.job_position.name || 'Colaborador');
      } else {
        job = ads.area_type_name || 'Personal Operativo';
      }
    }
    const formattedSender = `${fullName}, ${job}`;

    if (payloadAction === 'despachar') {
      payload.notificacion = {
        titulo: 'Nuevo Documento Recibido',
        mensaje: `El ${formattedSender}, solicita la recepción del ${resolvedDocClass} No. ${docNum}`,
        path: `/operatividad/documento/${doc.clase_documento}`,
        query_params: {
          tipo: 'directo',
          bandeja: 'Recibidos',
        },
      };
    } 
    else if (payloadAction === 'solicitar_revision') {
      payload.notificacion = {
        titulo: 'Solicitud de Revisión',
        mensaje: `El ${formattedSender}, solicita la revisión del ${resolvedDocClass} No. ${docNum}`,
        path: `/operatividad/documento/${doc.clase_documento}`,
        query_params: {
          tipo: this.selectedTipo,
          bandeja: '📋 Para revisión',
        },
      };
    }
    else if (payloadAction === 'revisar') {
      payload.notificacion = {
        titulo: 'Documento Aprobado',
        mensaje: `El revisor ha aprobado el ${resolvedDocClass} No. ${docNum}.`,
        path: `/operatividad/documento/${doc.clase_documento}`,
        query_params: {
          tipo: this.selectedTipo,
          bandeja: '✔️ Revisado',
        },
      };
    }
    else if (payloadAction === 'devolver_correcciones') {
      payload.notificacion = {
        titulo: 'Documento Devuelto con Observaciones',
        mensaje: `El revisor ha devuelto con observaciones el ${resolvedDocClass} No. ${docNum}.`,
        path: `/operatividad/documento/${doc.clase_documento}`,
        query_params: {
          tipo: this.selectedTipo,
          bandeja: '⚠️ En correccion',
        },
      };
    }
    else if (payloadAction === 'rechazar') {
      payload.notificacion = {
        titulo: 'Documento Rechazado por Recepción',
        mensaje: `La recepción ha rechazado el ${resolvedDocClass} No. ${docNum}. Ha devuelto el documento a edición.`,
        path: `/operatividad/documento/${doc.clase_documento}`,
        query_params: {
          tipo: this.selectedTipo,
          bandeja: '✏️ En edición',
        },
      };
    }

    try {
      if (payloadAction === 'rechazar') {
        await this._documentService.rejectAction(doc.id, payload);
      } else {
        await this._documentService.processAction(doc.id, payload);
      }

      this.actionSuccess.set('Acción completada con éxito.');
      setTimeout(async () => {
        this.closeActionForm();
        this.actionCompleted.emit();
        if (payloadAction === 'solicitar_revision') {
          this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { bandeja: '🔍 En revision' },
            queryParamsHandling: 'merge'
          });
        } else if (payloadAction === 'autorizar') {
          this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { bandeja: '📦 Para despachar' },
            queryParamsHandling: 'merge'
          });
        } else if (payloadAction === 'firmar_y_despachar') {
          this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { bandeja: '✅ Entregados' },
            queryParamsHandling: 'merge'
          });
        } else if (payloadAction === 'despachar') {
          this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { bandeja: '📤 Despachados' },
            queryParamsHandling: 'merge'
          });
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error al procesar la acción:', error);
      this.actionError.set(
        error?.error?.message || 
        error?.message || 
        'Ocurrió un error inesperado al enviar la solicitud.'
      );
    } finally {
      this.isActionLoading.set(false);
    }
  }

  onSignatureSuccess(result: string) {
    this.isSignatureModalOpen.set(false);
    this.actionSuccess.set('Documento firmado y despachado con éxito.');
    setTimeout(() => {
      this.closeActionForm();
      this.actionCompleted.emit();
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: { bandeja: '📥 Entregados' },
        queryParamsHandling: 'merge'
      });
    }, 1500);
  }
}
