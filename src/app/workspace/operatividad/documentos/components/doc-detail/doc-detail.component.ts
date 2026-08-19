import { Component, OnDestroy, inject, signal, computed, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';

import { PdfViewerComponent             } from '@system-shared/media/pdf-viewer/pdf-viewer.component';
import { HtmlViewerComponent            } from '@system-shared/media/html-viewer/html-viewer.component';
import { ViewerOption                   } from '@system-shared/media/viewer-selector/viewer-selector.component';
import { TitleComponent                 } from '@system-shared/ui/title/title.component';
import { DetailDocumentCardComponent    } from '../detail-document-card/detail-document-card.component';

import { DocumentService                } from '../../services/document.service';
import { DocumentPermissionsService     } from '../../services/document-permissions.service';
import { AttachmentService              } from '@core/services/attachment.service';

@Component({
  selector: 'doc-detail',
  standalone: true,
  imports: [
    CommonModule,
    PdfViewerComponent,
    HtmlViewerComponent,
    TitleComponent,
    DetailDocumentCardComponent
  ],
  templateUrl: './doc-detail.component.html',
})
export class DocDetailComponent implements OnDestroy {
  @Input() selectedTipo: any;
  @Input() claseDocumentoId: any;
  @Input() set doc(val: any | null) {
    this._doc.set(val);
  }
  get doc() { return this._doc(); }
  private _doc = signal<any | null>(null);

  @Output() actionCompleted = new EventEmitter<void>();

  private _documentService = inject(DocumentService);
  private _attachmentService = inject(AttachmentService);
  private _router = inject(Router);
  public docPermissions = inject(DocumentPermissionsService);
  private _sanitizer = inject(DomSanitizer);

  pdfViewerUrl = signal<SafeResourceUrl | null>(null);
  rawPdfUrl = signal<string | null>(null);
  isLoadingPdf = signal<boolean>(false);
  isRegeneratingPdf = signal<boolean>(false);
  selectedViewerOption = signal<ViewerOption | null>(null);

  viewerOptions = computed(() => {
    const activeDoc = this._doc();
    const options: ViewerOption[] = [];
    if (!activeDoc) return options;
    
    options.push({
      id: activeDoc.id,
      label: 'Documento Principal',
      sublabel: activeDoc.estatus_emisor === 'despachado' || activeDoc.estatus_emisor === 'entregado' ? 'PDF Oficial' : 'PDF Borrador',
      type: 'document'
    });

    if (activeDoc.is_final_render) {
      options[0].sublabel = 'PDF Consolidado';
    }

    if (!activeDoc.is_final_render && activeDoc.attachments && activeDoc.attachments.length > 0) {
      options.push({
        id: activeDoc.id,
        label: 'Documento + Anexos',
        sublabel: 'PDF Combinado',
        type: 'merged'
      });
    }

    if (activeDoc.attachments && activeDoc.attachments.length > 0) {
      for (const att of activeDoc.attachments) {
        if (att.is_pdf || (att.file_name || "").toLowerCase().endsWith('.pdf')) {
          options.push({
            id: att.id,
            label: att.file_name,
            sublabel: 'Anexo (PDF)',
            type: 'attachment'
          });
        }
      }
    }
    return options;
  });

  onOpenViewer(event: { type: string, id?: string, doc?: any }) {
    if (event.doc) {
      this._doc.set(event.doc);
    }
    if (event.type === 'draft' || event.type === 'final') {
      const activeDoc = this.doc;
      if (!activeDoc) return;
      this.closePdfViewer();
      const docOption: ViewerOption = {
        id: activeDoc.id,
        label: 'Documento Principal',
        sublabel: event.type === 'final' ? 'PDF Oficial' : 'PDF Borrador',
        type: 'document'
      };
      this.selectedViewerOption.set(docOption);
      this.loadPdfForOption(docOption);
    } else if (event.type === 'emergency') {
      const activeDoc = this.doc;
      if (!activeDoc) return;
      this.closePdfViewer();
      const emergencyOption: ViewerOption = {
        id: activeDoc.id,
        label: 'Documento Principal',
        sublabel: 'HTML de Emergencia',
        type: 'emergency'
      };
      this.selectedViewerOption.set(emergencyOption);
      this.loadPdfForOption(emergencyOption);
    } else if (event.type === 'merged') {
      const mergedOption = this.viewerOptions().find(o => o.type === 'merged' && o.id === event.id);
      if (mergedOption) {
        this.selectedViewerOption.set(mergedOption);
        this.loadPdfForOption(mergedOption);
      }
    } else if (event.type === 'attachment') {
      const attOption = this.viewerOptions().find(o => o.id === event.id && o.type === 'attachment');
      if (attOption) {
        this.selectedViewerOption.set(attOption);
        this.loadPdfForOption(attOption);
      }
    }
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
      } else if (option.type === 'emergency') {
        const blob = await this._documentService.downloadEmergencyHtml(option.id);
        const fileURL = URL.createObjectURL(blob);
        this.rawPdfUrl.set(fileURL);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
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
      this.onOpenViewer({ type: isDraft ? 'draft' : 'final' });
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

    @ViewChild(DetailDocumentCardComponent) cardComponent!: DetailDocumentCardComponent;

  closeActionForm() {
    if (this.cardComponent) {
      this.cardComponent.closeActionForm();
    }
  }

  handleSignAutograph() {
    this.closePdfViewer();
    if (this.cardComponent) {
      this.cardComponent.showActionForm('despachar');
    }
  }

  handleSignDigital() {
    this.closePdfViewer();
    if (this.cardComponent) {
      this.cardComponent.actionForms?.submitAction('firmar_y_despachar');
    }
  }

  openPdf(type: 'draft' | 'final', docToOpen?: any) {
    this.onOpenViewer({ type, doc: docToOpen });
  }

  ngOnDestroy() {
    const rawUrl = this.rawPdfUrl();
    if (rawUrl) {
      if (!this._documentService.isUrlCached(rawUrl)) {
        URL.revokeObjectURL(rawUrl);
      }
    }
  }
}








