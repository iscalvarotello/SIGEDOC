import { Component, OnDestroy, inject, signal, computed, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { Router                         } from '@angular/router';
import { FormsModule                    } from '@angular/forms';
import { SesionService                  } from '@core/services/sesion.service';

import { ActionButtonComponent          } from '@system-shared/buttons/action-button/action-button.component';
import { ButtonOkComponent              } from '@system-shared/buttons/button-ok/button-ok.component';
import { ButtonXComponent               } from '@system-shared/buttons/button-x/button-x.component';
import { OpenPdfButtonComponent         } from '@system-shared/buttons/open-pdf-button/open-pdf-button.component';
import { PreviewPdfButtonComponent      } from '@system-shared/buttons/preview-pdf-button/preview-pdf-button.component';
import { MergePdfButtonComponent        } from '@system-shared/buttons/merge-pdf-button/merge-pdf-button.component';

import { IconComponent                  } from '@system-shared/common/icon/icon.component';

import { AttachmentService              } from '@core/services/attachment.service';
import { AreaService                    } from '@organization/areas/area.service';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';

import { PdfViewerComponent             } from '@system-shared/media/pdf-viewer/pdf-viewer.component';
import { ViewerOption                   } from '@system-shared/media/viewer-selector/viewer-selector.component';
import { GlobeComponent                 } from '@system-shared/ui/globe/globe.component';
import { TitleComponent                 } from '@system-shared/ui/title/title.component';
import { BadgeComponent                 } from '@system-shared/ui/badge/badge.component';
import { GoogleDriveViewerLinkComponent } from '@system-shared/media/google-drive-viewer-link/google-drive-viewer-link.component';

import { ClaseDocumentoId               } from '../../interfaces/document.interface';
import { DocActionsToolbarComponent     } from '../doc-actions-toolbar/doc-actions-toolbar.component';
import { DocCcpListComponent            } from '../doc-ccp-list/doc-ccp-list.component';
import { DocAttachmentsListComponent    } from '../doc-attachments-list/doc-attachments-list.component';
import { DocActionFormsComponent        } from '../doc-action-forms/doc-action-forms.component';
import { MetaDataDocComponent           } from '../meta-data-doc/meta-data-doc.component';
import { DocumentService                } from '../../services/document.service';
import { DocHistoryLinksComponent       } from '../doc-history-links/doc-history-links.component';

import { TopicComponent                 } from '@system-shared/form/topic/topic.component';


@Component({
  selector: 'doc-detail',
  standalone: true,
  imports: [ActionButtonComponent,
    CommonModule,
    FormsModule,
    PdfViewerComponent,
    TopicComponent,
    DocActionsToolbarComponent,
    DocCcpListComponent,
    DocAttachmentsListComponent,
    DocActionFormsComponent,
    ButtonOkComponent,
    ButtonXComponent,
    DocHistoryLinksComponent,
    GoogleDriveViewerLinkComponent,
    OpenPdfButtonComponent,
    PreviewPdfButtonComponent,
    MergePdfButtonComponent,
    MetaDataDocComponent,
    GlobeComponent,
    BadgeComponent,
    IconComponent,
    TitleComponent],
  templateUrl: './doc-detail.component.html',
})
export class DocDetailComponent implements OnDestroy {
  @ViewChild('actionForms') actionForms!: DocActionFormsComponent;

  // Input con Setter para limpiar formularios y recargar anexos
  private previousStatus: string | null = null;
  
  @Input() set doc(val: any | null) {
    const prev = this.previousStatus;
    if (val) {
      this.previousStatus = val.estatus;
    }
    
    this._doc.set(val);
    this.closeActionForm();
    this.isEditingDetails.set(false);
    
    if (val && prev && val.estatus === 'En revisión' && prev !== 'En revisión') {
      this._router.navigate(['/workspace/documentos/bandeja/en-revision']);
    }

    if (val && val.id) {
      this.loadSelectedDocAttachments(val.id);
      this.loadDocLogs(val.id);
    } else {
      this.selectedDocAttachments.set([]);
      this.docLogs.set([]);
    }
  }
  get doc() { return this._doc(); }
  private _doc = signal<any | null>(null);

  docLogs = signal<any[]>([]);
  isLoadingLogs = signal<boolean>(false);
  selectedTab = signal<'detalles' | 'historial'>('detalles');

  async loadDocLogs(id: string) {
    this.isLoadingLogs.set(true);
    try {
      const res = await this._documentService.getLogs(id);
      this.docLogs.set(res);
    } catch(e) {
      console.error(e);
      this.docLogs.set([]);
    } finally {
      this.isLoadingLogs.set(false);
    }
  }

  private _areaService = inject(AreaService);
  private _session = inject(SesionService);
  
  isReviewer = computed(() => {
    const docVal = this._doc();
    return docVal ? (docVal.id_revisor == this._session.currentUserData()?.id_empleado || docVal.id_revisor == this._session.dataUser.idUser) : false;
  });

  editTemas = '';
  editAsunto = '';
  isEditingDetails = signal<boolean>(false);
  isSavingDetails = signal<boolean>(false);

  canEditDetails = computed(() => {
    const docVal = this._doc();
    if (!docVal) return false;
    const status = docVal.estatus_emisor;
    return status && 
           status !== 'despachado' && status !== 'entregado' && status !== 'cancelado' &&
           status !== 'DESPACHADO' && status !== 'ENTREGADO' && status !== 'CANCELADO';
  });

  canConsolidate = computed(() => {
    const docVal = this._doc();
    if (!docVal) return false;
    
    const isReceived = docVal.estatus_receptor === 'RECIBIDO' || docVal.estatus_receptor === 'recibido';
    const isNotSealed = docVal.is_final_render === false || !docVal.is_final_render;
    
    return isReceived && isNotSealed;
  });

  isConsolidating = signal<boolean>(false);

  startEditingDetails() {
    const docVal = this._doc();
    if (!docVal) return;
    this.editTemas = docVal.temas || '';
    this.editAsunto = docVal.asunto || '';
    this.isEditingDetails.set(true);
  }

  cancelEditingDetails() {
    this.isEditingDetails.set(false);
  }

  async saveDetails() {
    const docVal = this._doc();
    if (!docVal) return;

    this.isSavingDetails.set(true);
    try {
      const updated = await this._documentService.update(docVal.id, {
        asunto: this.editAsunto.trim(),
        temas: this.editTemas.trim()
      });

      // Actualizar el documento localmente
      docVal.asunto = updated.asunto;
      docVal.temas = updated.temas;
      this._doc.set({ ...docVal });

      this.isEditingDetails.set(false);
      this.actionCompleted.emit(); // Para refrescar la lista
    } catch (error: any) {
      console.error('Error al actualizar asunto/tema:', error);
      alert(error?.error?.message || 'Error al guardar los cambios.');
    } finally {
      this.isSavingDetails.set(false);
    }
  }

  @Input() selectedTipo: 'directo' | 'gestionado' | 'recibido_externo' = 'directo';
  @Input() claseDocumentoId: ClaseDocumentoId = 'memo';

  @Output() actionCompleted = new EventEmitter<void>();

  // Inyección de Servicios
  private _documentService = inject(DocumentService);
  private _sanitizer = inject(DomSanitizer);
  private _attachmentService = inject(AttachmentService);
  private _router = inject(Router);

  // Estados del Visor de PDF
  pdfViewerUrl = signal<SafeResourceUrl | null>(null);
  rawPdfUrl = signal<string | null>(null);
  isLoadingPdf = signal<boolean>(false);
  isRegeneratingPdf = signal<boolean>(false);
  selectedViewerOption = signal<ViewerOption | null>(null);

  // Estados de Anexos y Comentarios
  isCommentsLoading = signal<boolean>(false);
  isLoadingSelectedDocAttachments = signal<boolean>(false);
  selectedDocAttachments = signal<any[]>([]);

  // Formularios de Acciones
  activeActionForm = signal<string | null>(null);


  // Opciones calculadas del selector de archivos en el visor de PDF
  isPdf(filenameOrExt: string): boolean {
    const name = (filenameOrExt || '').toLowerCase();
    return name.endsWith('.pdf') || name === 'pdf' || name === '.pdf';
  }

  viewerOptions = computed<ViewerOption[]>(() => {
    const doc = this.doc;
    if (!doc) return [];

    const isDraft = !(doc.estatus_emisor === 'despachado' || doc.estatus_emisor === 'entregado');
    const docOption: ViewerOption = {
      id: doc.id,
      label: 'Documento Principal',
      sublabel: isDraft ? 'PDF Borrador' : 'PDF Oficial',
      type: 'document',
    };

    if (doc.is_final_render) {
      return [docOption];
    }

    const attachments = this.selectedDocAttachments() || [];
    const pdfAttachments = attachments.filter((att: any) => 
      this.isPdf(att.extension || att.attachment_title || att.attachment_name)
    );

    const attOptions: ViewerOption[] = pdfAttachments.map((att: any) => ({
      id: att.id_attachment,
      label: att.attachment_name || 'Anexo sin nombre',
      sublabel: att.attachment_title || 'Archivo adjunto',
      type: 'attachment',
    }));

    const allOptions = [docOption];

    if (pdfAttachments.length > 0) {
      allOptions.push({
        id: doc.id,
        label: 'Documento Fusionado',
        sublabel: 'Incluye todos los anexos',
        type: 'merged',
      });
    }

    allOptions.push(...attOptions);
    return allOptions;
  });

  ngOnDestroy() {
    this.closePdfViewer();
  }

  isPdfAttachment(filenameOrExt: string): boolean {
    return this.isPdf(filenameOrExt);
  }

  // Cargar anexos en caliente
  async loadSelectedDocAttachments(docId: string) {
    this.isLoadingSelectedDocAttachments.set(true);
    try {
      const res = await this._documentService.getAttachments(docId);
      
      const docVal = this.doc;
      const isConsolidated = !!docVal?.is_final_render;
      const canEdit = docVal?.bandeja === '✏️ En edición' || docVal?.bandeja === '⚠️ En correccion';

      const mapped = (res || []).map((att: any) => ({
        ...att,
        canView: this.isPdfAttachment(att.extension || att.attachment_name) && !isConsolidated,
        canDownload: !isConsolidated,
        canDelete: canEdit,
        canReorder: canEdit
      }));

      this.selectedDocAttachments.set(mapped);
    } catch (err) {
      console.error('Error al cargar anexos en DocDetailComponent:', err);
      // Fallback
      if (this.doc && this.doc.id === docId) {
        this.selectedDocAttachments.set(this.doc.attachments || []);
      } else {
        this.selectedDocAttachments.set([]);
      }
    } finally {
      this.isLoadingSelectedDocAttachments.set(false);
    }
  }

  async handleAttachmentDelete(id_attachment: string) {
    const docVal = this.doc;
    if (!docVal) return;
    if (!confirm('⚠️ ¿Estás seguro de desvincular este anexo del documento?')) return;
    
    try {
      const list = this.selectedDocAttachments().filter(a => a.id_attachment !== id_attachment);
      await this._documentService.updateAttachments(docVal.id, list);
      this.selectedDocAttachments.set(list);
      alert('Anexo desvinculado con éxito.');
      this.actionCompleted.emit();
    } catch (e: any) {
      console.error('Error al eliminar anexo:', e);
      alert('Ocurrió un error al eliminar el anexo:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
    }
  }

  async handleAttachmentReorder(event: { index: number, direction: 'up' | 'down' }) {
    const docVal = this.doc;
    if (!docVal) return;

    const list = [...this.selectedDocAttachments()];
    const targetIndex = event.direction === 'up' ? event.index - 1 : event.index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    [list[event.index], list[targetIndex]] = [list[targetIndex], list[event.index]];

    try {
      await this._documentService.updateAttachments(docVal.id, list.map(a => ({
        id_attachment: a.id_attachment,
        attachment_name: a.attachment_name,
        attachment_title: a.attachment_title,
        extension: a.extension,
      })));
      this.selectedDocAttachments.set(list);
      this.actionCompleted.emit();
    } catch (e: any) {
      console.error('Error al reordenar anexos:', e);
      alert('Ocurrió un error al reordenar los anexos:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
    }
  }

  async handleAttachmentView(id_attachment: string) {
    const attOption = this.viewerOptions().find(o => o.id === id_attachment && o.type === 'attachment');
    if (attOption) {
      this.selectedViewerOption.set(attOption);
      await this.loadPdfForOption(attOption);
    } else {
      // Fallback
      this.handleAttachmentDownload(id_attachment);
    }
  }

  handleAttachmentDownload(id_attachment: string) {
    const url = this._attachmentService.getDownloadUrl(id_attachment);
    window.open(url, '_blank');
  }

  // Cerrar formularios
  closeActionForm() {
    this.activeActionForm.set(null);
  }

  // Abrir formularios de acción
  showActionForm(action: string) {
    this.activeActionForm.set(action);
  }

  // PDF Viewer Methods
  async openPdf(type: 'draft' | 'final', docToOpen?: any) {
    if (docToOpen) {
      this._doc.set(docToOpen);
    }
    const activeDoc = this.doc;
    if (!activeDoc) return;

    this.closePdfViewer();

    const docOption: ViewerOption = {
      id: activeDoc.id,
      label: 'Documento Principal',
      sublabel: type === 'draft' ? 'PDF Borrador' : 'PDF Oficial',
      type: 'document',
    };

    this.selectedViewerOption.set(docOption);
    await this.loadPdfForOption(docOption);
  }

  async openMergedPdf(docId: string) {
    const activeDoc = this.doc;
    if (!activeDoc || activeDoc.id !== docId) return;

    const mergedOption: ViewerOption = {
      id: activeDoc.id,
      label: 'Documento Fusionado',
      sublabel: 'Incluye todos los anexos',
      type: 'merged',
    };

    this.selectedViewerOption.set(mergedOption);
    await this.loadPdfForOption(mergedOption);
  }

  async loadPdfForOption(option: ViewerOption) {
    this.isLoadingPdf.set(true);
    
    const rawUrl = this.rawPdfUrl();
    if (rawUrl) {
      if (!this._documentService.isUrlCached(rawUrl)) {
        URL.revokeObjectURL(rawUrl);
      }
      this.rawPdfUrl.set(null);
    }
    this.pdfViewerUrl.set(null);

    const activeDoc = this.doc;
    if (!activeDoc) {
      this.isLoadingPdf.set(false);
      return;
    }

    try {
      if (option.type === 'document') {
        const isDraft = option.sublabel === 'PDF Borrador';
        let blob: Blob;

        if (isDraft) {
          await this._documentService.testPdf(option.id);
          blob = await this._documentService.downloadPdf(option.id);
        } else {
          const cachedUrl = this._documentService.getCachedPdf(option.id);
          if (cachedUrl) {
            this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(cachedUrl));
            this.isLoadingPdf.set(false);
            return;
          }
          blob = await this._documentService.downloadPdf(option.id);
        }

        const fileURL = URL.createObjectURL(blob);
        this.rawPdfUrl.set(fileURL);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));

        if (!isDraft) {
          this._documentService.setCachedPdf(option.id, blob, fileURL);
        }
      } else if (option.type === 'merged') {
        const cachedUrl = this._documentService.getCachedMergedPdf(option.id);
        if (cachedUrl) {
          this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(cachedUrl));
          this.isLoadingPdf.set(false);
          return;
        }

        const blob = await this._documentService.downloadMergedPdf(option.id);
        const fileURL = URL.createObjectURL(blob);
        this.rawPdfUrl.set(fileURL);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
        this._documentService.setCachedMergedPdf(option.id, blob, fileURL);
      } else {
        const url = this._attachmentService.getDownloadUrl(option.id);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(url));
      }
    } catch (error: any) {
      console.error('Error loading PDF in DocDetailComponent:', error);
      let message = 'El archivo PDF solicitado no está disponible en este momento.';
      if (error?.error instanceof Blob) {
        try {
          const text = await error.error.text();
          const errObj = JSON.parse(text);
          message = errObj.message || message;
        } catch {}
      } else if (error?.error?.message) {
        message = error.error.message;
      } else if (error?.message) {
        message = error.message;
      }
      alert(message);
    } finally {
      this.isLoadingPdf.set(false);
    }
  }

  onOptionSelected(option: ViewerOption | null) {
    this.selectedViewerOption.set(option);
    if (option) {
      this.loadPdfForOption(option);
    } else {
      this.closePdfViewer();
    }
  }

  closePdfViewer() {
    const rawUrl = this.rawPdfUrl();
    if (rawUrl) {
      if (!this._documentService.isUrlCached(rawUrl)) {
        URL.revokeObjectURL(rawUrl);
      }
    }
    this.rawPdfUrl.set(null);
    this.pdfViewerUrl.set(null);
    this.selectedViewerOption.set(null);
    this.isLoadingPdf.set(false);
  }


  async onRegeneratePdf() {
    const activeDoc = this.doc;
    if (!activeDoc) return;
    
    this.isRegeneratingPdf.set(true);
    try {
      await this._documentService.regeneratePdf(activeDoc.id);
      this._documentService.clearCachedPdf(activeDoc.id);
      
      const isDraft = !(activeDoc.estatus_emisor === 'despachado' || activeDoc.estatus_emisor === 'entregado');
      await this.openPdf(isDraft ? 'draft' : 'final');
    } catch (err: any) {
      alert(err?.error?.message || err?.message || 'Error al regenerar el documento');
    } finally {
      this.isRegeneratingPdf.set(false);
    }
  }

  openPdfInNewTab() {
    const activeDoc = this.doc;
    if (activeDoc) {
      const isDraft = !(activeDoc.estatus_emisor === 'despachado' || activeDoc.estatus_emisor === 'entregado');
      const url = this._router.serializeUrl(
        this._router.createUrlTree(['/view-document', activeDoc.id], {
          queryParams: { type: isDraft ? 'draft' : 'final' },
        })
      );
      window.open(url, '_blank');
      this.closePdfViewer();
    }
  }

  // Observaciones
  async deleteComments(actionType?: 'ok' | 'x') {
    const activeDoc = this.doc;
    if (!activeDoc) return;
    
    const message = actionType === 'ok' 
      ? '¿Está seguro de que desea marcar como atendidas estas observaciones? (Esto las eliminará del documento)'
      : '¿Está seguro de que desea eliminar las observaciones/comentarios de este documento?';

    if (!confirm(message)) {
      return;
    }

    this.isCommentsLoading.set(true);
    try {
      await this._documentService.updateComments(activeDoc.id, null);
      activeDoc.comentarios = null;
      this.actionCompleted.emit();
    } catch (err: any) {
      alert(err?.error?.message || err?.message || 'Error al intentar eliminar las observaciones.');
    } finally {
      this.isCommentsLoading.set(false);
    }
  }

  // Ruteadores
  replyDocument() {
    if (!this.doc) return;
    this._router.navigate(['/operatividad/form-new-document', this.claseDocumentoId], {
      queryParams: { reply_to: this.doc.id },
    });
  }

  followUpDocument() {
    if (!this.doc) return;
    this._router.navigate(['/operatividad/form-new-document', this.claseDocumentoId], {
      queryParams: { follow_up_to: this.doc.id },
    });
  }

  makeFollowUpDocument() {
    if (!this.doc) return;
    this._router.navigate(['/operatividad/form-new-document', this.claseDocumentoId], {
      queryParams: { 
        follow_up_to: this.doc.id, 
        from_despacho: true,
      },
    });
  }

  async onConsolidateDocument() {
    const activeDoc = this.doc;
    if (!activeDoc) return;

    if (!confirm('¿Está seguro de consolidar el documento? Esta acción unirá permanentemente todos los anexos PDF al documento oficial y no se podrá deshacer.')) {
      return;
    }

    this.isConsolidating.set(true);
    try {
      await this._documentService.consolidateDocument(activeDoc.id);
      
      // Update local state to reflect consolidation
      activeDoc.is_final_render = true;
      this._doc.set({ ...activeDoc });
      
      // Clear the cached PDF so the viewer downloads the newly merged one
      this._documentService.clearCachedPdf(activeDoc.id);
      
      this.actionCompleted.emit();
    } catch (err: any) {
      alert(err?.error?.message || err?.message || 'Error al intentar consolidar el documento.');
    } finally {
      this.isConsolidating.set(false);
    }
  }

  async onAutoRechazar() {
    const activeDoc = this.doc;
    if (!activeDoc) return;

    if (!confirm('¿Está seguro de querer rechazar su propio documento? Esto lo devolverá al estado de edición y eliminará las firmas actuales.')) {
      return;
    }

    this.isConsolidating.set(true); // Reusing the loading state or can create a new one
    try {
      await this._documentService.processAction(activeDoc.id, { action: 'rechazar', comentarios: 'Autorechazo por parte del creador.' });
      this.actionCompleted.emit();
    } catch (err: any) {
      alert(err?.error?.message || err?.message || 'Error al intentar autorechazar el documento.');
    } finally {
      this.isConsolidating.set(false);
    }
  }
}
