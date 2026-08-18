import { Component, OnDestroy, inject, signal, computed, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

import { GlobeComponent                 } from '@system-shared/ui/globe/globe.component';
import { TitleComponent                 } from '@system-shared/ui/title/title.component';
import { BadgeComponent                 } from '@system-shared/ui/badge/badge.component';

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
  selector: 'detail-document-card',
  standalone: true,
  imports: [
    ActionButtonComponent, CommonModule, RouterLink, FormsModule,
    TopicComponent, DocActionsToolbarComponent, DocCcpListComponent,
    DocAttachmentsListComponent, DocActionFormsComponent, ButtonOkComponent,
    ButtonXComponent, DocHistoryLinksComponent, OpenPdfButtonComponent,
    PreviewPdfButtonComponent, MergePdfButtonComponent, MetaDataDocComponent,
    GlobeComponent, BadgeComponent, IconComponent],
  templateUrl: './detail-document-card.component.html',
})
export class DetailDocumentCardComponent implements OnDestroy {
  @ViewChild('actionForms') actionForms!: DocActionFormsComponent;

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

  @Output() openViewer = new EventEmitter<{type: string, id?: string, doc?: any}>();
  @Output() actionCompleted = new EventEmitter<void>();

  docLogs = signal<any[]>([]);
  isLoadingLogs = signal<boolean>(false);
  selectedTab = signal<'detalles' | 'historial'>('detalles');

  isEditingDetails = signal<boolean>(false);
  editTemas = signal<string>('');
  editAsunto = signal<string>('');
  isSavingDetails = signal<boolean>(false);

  isCommentsLoading = signal<boolean>(false);
  isRenderingGoogleDocs = signal<boolean>(false);
  isConsolidating = signal<boolean>(false);

  activeActionForm = signal<string | null>(null);

  selectedDocAttachments = signal<any[]>([]);
  isLoadingSelectedDocAttachments = signal<boolean>(false);

  private _documentService = inject(DocumentService);
  private _attachmentService = inject(AttachmentService);
  private _router = inject(Router);
  private _sesion = inject(SesionService);

  isCreator = computed(() => {
    const doc = this._doc();
    const employeeId = this._sesion.currentUserData()?.id_empleado;
    return doc && doc.creador && (doc.creador.id === employeeId || doc.creador.id_empleado === employeeId);
  });

  isReviewer = computed(() => {
    const doc = this._doc();
    if (!doc) return false;
    const employeeId = this._sesion.currentUserData()?.id_empleado;
    
    if (doc.creador && (doc.creador.id === employeeId || doc.creador.id_empleado === employeeId)) return true;
    if (doc.turnado_a && (doc.turnado_a.id === employeeId || doc.turnado_a.id_empleado === employeeId)) return true;
    if (doc.revisor && (doc.revisor.id === employeeId || doc.revisor.id_empleado === employeeId)) return true;
    
    return false;
  });

  canEditDetails = computed(() => { return this.isCreator() || this.isReviewer(); });

  get selectedTipo() { return this.doc?.tipo_documento; }
  get claseDocumentoId(): ClaseDocumentoId {
    if (!this.doc) return 'oficio';
    return this.doc.clase_documento === 'M' ? 'memo' : 'oficio';
  }

  async renderGoogleDocs(docId: string) {
    this.isRenderingGoogleDocs.set(true);
    try {
      await this._documentService.processAction(docId, { action: 'render' });
      this.actionCompleted.emit();
    } catch (e: any) {
      alert('Error renderizando Google Docs: ' + (e?.error?.message || e?.message));
    } finally {
      this.isRenderingGoogleDocs.set(false);
    }
  }

  openDriveLink(url: string) { if (url) { window.open(url, '_blank'); } }

  startEditingDetails() {
    if (!this.doc) return;
    this.editTemas.set(this.doc.temas || '');
    this.editAsunto.set(this.doc.asunto || '');
    this.isEditingDetails.set(true);
  }

  cancelEditingDetails() { this.isEditingDetails.set( false ) ; }

  async saveDetails() {
    if (!this.doc) return;
    this.isSavingDetails.set(true);
    try {
      const updated = await this._documentService.update(this.doc.id, {
        temas: this.editTemas(),
        asunto: this.editAsunto()
      });
      const currentDoc = this.doc;
      currentDoc.temas = updated.temas;
      currentDoc.asunto = updated.asunto;
      this._doc.set({ ...currentDoc });
      this.isEditingDetails.set(false);
    } catch (error: any) {
      alert(error?.error?.message || 'Error al guardar los cambios.');
    } finally {
      this.isSavingDetails.set(false);
    }
  }

  async loadDocLogs(docId: string) {
    this.isLoadingLogs.set(true);
    try {
      const logs = await this._documentService.getLogs(docId);
      this.docLogs.set(logs);
    } catch (e) {
      console.error('Error loading logs', e);
      this.docLogs.set([]);
    } finally {
      this.isLoadingLogs.set(false);
    }
  }

  async loadSelectedDocAttachments(docId: string) {
    this.isLoadingSelectedDocAttachments.set(true);
    try {
      const attachments = await this._documentService.getAttachments(docId);
      this.selectedDocAttachments.set(attachments || []);
    } catch (e) {
      console.error('Error loading attachments:', e);
      this.selectedDocAttachments.set([]);
    } finally {
      this.isLoadingSelectedDocAttachments.set(false);
    }
  }

  isPdfAttachment(filenameOrExt: string): boolean {
    if (!filenameOrExt) return false;
    return filenameOrExt.toLowerCase().endsWith('.pdf') || filenameOrExt.toLowerCase() === 'pdf';
  }

  handleAttachmentView(id_attachment: string) {
    this.openViewer.emit({ type: 'attachment', id: id_attachment });
  }

  async handleAttachmentDelete(id_attachment: string) {
    if (!confirm('¿Seguro que deseas eliminar y desvincular este anexo?')) return;
    try {
      const updated = this.selectedDocAttachments().filter((a:any) => a.id !== id_attachment); 
      await this._documentService.updateAttachments(this.doc.id, updated);
      if (this.doc) {
        this.loadSelectedDocAttachments(this.doc.id);
        this.actionCompleted.emit();
      }
      alert('Anexo desvinculado con éxito.');
    } catch (e: any) {
      alert('Ocurrió un error al eliminar el anexo:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
    }
  }

  async handleAttachmentReorder(event: { index: number, direction: 'up' | 'down' }) {
    try {
      const current = [...this.selectedDocAttachments()]; 
      const index = event.index;
      
      if (event.direction === 'up' && index > 0) {
        const temp = current[index];
        current[index] = current[index - 1];
        current[index - 1] = temp;
      } else if (event.direction === 'down' && index < current.length - 1) {
        const temp = current[index];
        current[index] = current[index + 1];
        current[index + 1] = temp;
      }
      
      // Update orden values
      for (let i = 0; i < current.length; i++) {
        current[i].orden = i;
      }

      await this._documentService.updateAttachments(this.doc.id, current);
      if (this.doc) {
        this.selectedDocAttachments.set(current);
        this.actionCompleted.emit();
      }
    } catch (e: any) {
      alert('Ocurrió un error al reordenar los anexos:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
    }
  }

  handleAttachmentDownload(id_attachment: string) {
    const url = this._attachmentService.getDownloadUrl(id_attachment);
    window.open(url, '_blank');
  }

  closeActionForm() {
    this.activeActionForm.set(null);
  }

  showActionForm(action: string) {
    this.activeActionForm.set(action);
  }

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
      
      activeDoc.is_final_render = true;
      this._doc.set({ ...activeDoc });
      
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

    this.isConsolidating.set(true); 
    try {
      await this._documentService.processAction(activeDoc.id, { action: 'rechazar', comentarios: 'Autorechazo por parte del creador.' });
      this.actionCompleted.emit();
    } catch (err: any) {
      alert(err?.error?.message || err?.message || 'Error al intentar autorechazar el documento.');
    } finally {
      this.isConsolidating.set(false);
    }
  }

  openEmergencyHtml() {
    this.openViewer.emit({ type: 'emergency' });
  }

  openPdf(type: 'draft' | 'final', docToOpen?: any) {
    this.openViewer.emit({ type, doc: docToOpen });
  }

  openMergedPdf(docId: string) {
    this.openViewer.emit({ type: 'merged', id: docId });
  }

  ngOnDestroy() {}
}
