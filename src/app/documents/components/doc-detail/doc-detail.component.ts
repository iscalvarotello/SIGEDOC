import { Component, OnDestroy, inject, signal, computed, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { AttachmentService } from '../../../core/services/attachment.service';
import { AreaService } from '../../../blocks/CORE_DB/organization/areas/area.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerComponent } from '../../../shared/components/common/pdf-viewer/pdf-viewer.component';
import { ViewerOption } from '../../../shared/components/common/viewer-selector/viewer-selector.component';
import { ClaseDocumentoId } from '../../interfaces/document.interface';
import { DocActionsToolbarComponent } from '../doc-actions-toolbar/doc-actions-toolbar.component';
import { DocCcpListComponent } from '../doc-ccp-list/doc-ccp-list.component';
import { DocAttachmentsListComponent } from '../doc-attachments-list/doc-attachments-list.component';
import { DocActionFormsComponent } from '../doc-action-forms/doc-action-forms.component';
import { ButtonOkComponent } from '@shared/components/common/button-ok/button-ok.component';
import { ButtonXComponent } from '@shared/components/common/button-x/button-x.component';
import { DocHistoryLinksComponent } from '../doc-history-links/doc-history-links.component';
import { GoogleDriveViewerLinkComponent } from '@shared/components/common/google-drive-viewer-link/google-drive-viewer-link.component';
import { OpenPdfButtonComponent } from '@shared/components/common/open-pdf-button/open-pdf-button.component';
import { PreviewPdfButtonComponent } from '@shared/components/common/preview-pdf-button/preview-pdf-button.component';
import { MergePdfButtonComponent } from '@shared/components/common/merge-pdf-button/merge-pdf-button.component';
import { MetaDataDocComponent } from '../meta-data-doc/meta-data-doc.component';

@Component({
  selector: 'doc-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerComponent,
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
  ],
  templateUrl: './doc-detail.component.html',
})
export class DocDetailComponent implements OnDestroy {
  // Input con Setter para limpiar formularios y recargar anexos
  @Input() set doc(val: any | null) {
    this._doc.set(val);
    this.closeActionForm();
    this.isEditingDetails.set(false);
    if (val && val.id) {
      this.loadSelectedDocAttachments(val.id);
      if (val.id_area_emisora) {
        this.loadTemas(val.id_area_emisora);
      } else {
        this.temasList.set([]);
      }
    } else {
      this.selectedDocAttachments.set([]);
      this.temasList.set([]);
    }
  }
  get doc() { return this._doc(); }
  private _doc = signal<any | null>(null);

  private _areaService = inject(AreaService);

  editTema = '';
  editAsunto = '';
  isEditingDetails = signal<boolean>(false);
  isSavingDetails = signal<boolean>(false);
  temasList = signal<string[]>([]);

  canEditDetails = computed(() => {
    const docVal = this._doc();
    if (!docVal) return false;
    const status = docVal.estatus_emisor;
    return status && 
           status !== 'despachado' && status !== 'entregado' && status !== 'cancelado' &&
           status !== 'DESPACHADO' && status !== 'ENTREGADO' && status !== 'CANCELADO';
  });

  async loadTemas(areaId: string) {
    try {
      const list = await this._areaService.getTemas(areaId);
      this.temasList.set(list || []);
    } catch (e) {
      console.warn('GET /organization/areas/:id/temas not implemented or failed:', e);
      this.temasList.set([]);
    }
  }

  startEditingDetails() {
    const docVal = this._doc();
    if (!docVal) return;
    this.editTema = docVal.tema || '';
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
        tema: this.editTema.trim()
      });

      // Guardar el tema si es nuevo
      const newTema = this.editTema.trim();
      if (newTema && docVal.id_area_emisora && !this.temasList().includes(newTema)) {
        try {
          const updatedList = await this._areaService.addTema(docVal.id_area_emisora, newTema);
          this.temasList.set(updatedList);
        } catch (e) {
          console.warn('Failed to save new theme to area list:', e);
        }
      }

      // Actualizar el documento localmente
      docVal.asunto = updated.asunto;
      docVal.tema = updated.tema;
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

  @Input() selectedTipo: 'directo' | 'gestionado' = 'directo';
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
  selectedViewerOption = signal<ViewerOption | null>(null);

  // Estados de Anexos y Comentarios
  isCommentsLoading = signal<boolean>(false);
  isLoadingSelectedDocAttachments = signal<boolean>(false);
  selectedDocAttachments = signal<any[]>([]);

  // Formularios de Acciones
  activeActionForm = signal<string | null>(null);

  // Opciones calculadas del selector de archivos en el visor de PDF
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

    const attachments = this.selectedDocAttachments() || [];
    const attOptions: ViewerOption[] = attachments.map((att: any) => ({
      id: att.id_attachment,
      label: att.attachment_name || 'Anexo sin nombre',
      sublabel: att.attachment_title || 'Archivo adjunto',
      type: 'attachment',
    }));

    const allOptions = [docOption];

    if (attachments.length > 0) {
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

  // Cargar anexos en caliente
  async loadSelectedDocAttachments(docId: string) {
    this.isLoadingSelectedDocAttachments.set(true);
    try {
      const res = await this._documentService.getAttachments(docId);
      this.selectedDocAttachments.set(res || []);
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
    const activeDoc = docToOpen || this.doc;
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
          await this._documentService.testPdf(activeDoc.id);
          blob = await this._documentService.downloadPdf(activeDoc.id);
        } else {
          const cachedUrl = this._documentService.getCachedPdf(activeDoc.id);
          if (cachedUrl) {
            this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(cachedUrl));
            this.isLoadingPdf.set(false);
            return;
          }
          blob = await this._documentService.downloadPdf(activeDoc.id);
        }

        const fileURL = URL.createObjectURL(blob);
        this.rawPdfUrl.set(fileURL);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));

        if (!isDraft) {
          this._documentService.setCachedPdf(activeDoc.id, blob, fileURL);
        }
      } else if (option.type === 'merged') {
        const cachedUrl = this._documentService.getCachedMergedPdf(activeDoc.id);
        if (cachedUrl) {
          this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(cachedUrl));
          this.isLoadingPdf.set(false);
          return;
        }

        const blob = await this._documentService.downloadMergedPdf(activeDoc.id);
        const fileURL = URL.createObjectURL(blob);
        this.rawPdfUrl.set(fileURL);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
        this._documentService.setCachedMergedPdf(activeDoc.id, blob, fileURL);
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
    this._router.navigate(['/form-new-document', this.claseDocumentoId], {
      queryParams: { reply_to: this.doc.id },
    });
  }

  followUpDocument() {
    if (!this.doc) return;
    this._router.navigate(['/form-new-document', this.claseDocumentoId], {
      queryParams: { follow_up_to: this.doc.id },
    });
  }

  makeFollowUpDocument() {
    if (!this.doc) return;
    this._router.navigate(['/form-new-document', this.claseDocumentoId], {
      queryParams: { 
        follow_up_to: this.doc.id, 
        from_despacho: true,
      },
    });
  }


}
