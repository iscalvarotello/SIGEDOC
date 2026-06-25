import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';
import { AttachmentService } from '../../../core/services/attachment.service';
import { ViewerSelectorComponent, ViewerOption } from '../../../shared/components/common/viewer-selector/viewer-selector.component';

@Component({
  selector: 'app-document-viewer-page',
  standalone: true,
  imports: [CommonModule, ViewerSelectorComponent],
  templateUrl: './document-viewer-page.component.html'
})
export class DocumentViewerPageComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _documentService = inject(DocumentService);
  private _attachmentService = inject(AttachmentService);
  private _sanitizer = inject(DomSanitizer);

  documentId = signal<string | null>(null);
  pdfType = signal<'draft' | 'final'>('final');
  documentData = signal<any | null>(null);

  options = signal<ViewerOption[]>([]);
  selectedOption = signal<ViewerOption | null>(null);

  pdfViewerUrl = signal<SafeResourceUrl | null>(null);
  rawPdfUrl = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  isLoadingPdf = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  constructor() {
    // Constructor limpio, la carga asíncrona de PDF se realiza mediante eventos explícitos
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.documentId.set(id);
        
        // Leer el tipo de PDF (draft o final)
        this._route.queryParams.subscribe(qParams => {
          const type = qParams['type'] === 'draft' ? 'draft' : 'final';
          this.pdfType.set(type);
          
          this.loadDocumentData(id);
        });
      }
    });
  }

  isPdf(filenameOrExt: string): boolean {
    const name = (filenameOrExt || '').toLowerCase();
    return name.endsWith('.pdf') || name === 'pdf' || name === '.pdf';
  }

  async loadDocumentData(id: string) {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    try {
      console.log('[Viewer] loadDocumentData started for ID:', id);
      // Cargar metadatos del documento y anexos en paralelo
      const [doc, attachments] = await Promise.all([
        this._documentService.getById(id),
        this._documentService.getAttachments(id).catch(err => {
          console.warn('Fallo al obtener anexos del endpoint, usando fallback de metadata:', err);
          return null;
        })
      ]);

      this.documentData.set(doc);

      // Usar anexos devueltos por el endpoint o fallback a doc.attachments
      const finalAttachments = attachments || (doc as any).attachments || [];

      // Construir opciones del dropdown
      const isDraft = this.pdfType() === 'draft';
      const docOption: ViewerOption = {
        id: doc.id,
        label: 'Documento Principal',
        sublabel: isDraft ? 'PDF Borrador' : 'PDF Oficial',
        type: 'document'
      };

      const pdfAttachments = finalAttachments.filter((att: any) => 
        this.isPdf(att.extension || att.attachment_title || att.attachment_name)
      );

      const attOptions: ViewerOption[] = pdfAttachments.map((att: any) => ({
        id: att.id_attachment,
        label: att.attachment_name || 'Anexo sin nombre',
        sublabel: att.attachment_title || 'Archivo adjunto',
        type: 'attachment'
      }));

      const allOptions = [docOption];
      
      // Agregar opción de fusionado si existen anexos
      if (pdfAttachments.length > 0) {
        allOptions.push({
          id: doc.id,
          label: 'Documento Fusionado',
          sublabel: 'Incluye todos los anexos',
          type: 'merged'
        });
      }

      allOptions.push(...attOptions);
      this.options.set(allOptions);
      
      // Auto-seleccionar y cargar el documento principal
      console.log('[Viewer] Auto-selecting main document:', docOption);
      this.selectedOption.set(docOption);
      this.loadPdfForOption(docOption);

    } catch (err: any) {
      console.error('[Viewer] Error al cargar metadatos del documento:', err);
      this.errorMsg.set(
        err?.error?.message || 
        err?.message || 
        'No se pudo recuperar la información del documento solicitado.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onOptionSelected(option: ViewerOption | null) {
    console.log('[Viewer] Option selected in dropdown:', option);
    this.selectedOption.set(option);
    if (option) {
      this.loadPdfForOption(option);
    } else {
      this.clearPdfUrl();
    }
  }

  async loadPdfForOption(option: ViewerOption) {
    console.log('[Viewer] loadPdfForOption started for:', option.label, 'Type:', option.type);
    this.isLoadingPdf.set(true);
    this.clearPdfUrl();

    try {
      if (option.type === 'document') {
        const id = option.id;
        let fileURL: string;
        
        const isFinal = this.pdfType() === 'final';
        const cachedUrl = isFinal ? this._documentService.getCachedPdf(id) : null;
        
        if (cachedUrl) {
          console.log('[Viewer] Using cached final PDF:', cachedUrl);
          fileURL = cachedUrl;
        } else {
          let blob: Blob;
          console.log('[Viewer] Loading document PDF. pdfType is:', this.pdfType());
          if (this.pdfType() === 'draft') {
            console.log('[Viewer] Triggering testPdf (POST) for draft generation...');
            await this._documentService.testPdf(id);
            console.log('[Viewer] testPdf (POST) completed. Triggering downloadPdf (GET)...');
            blob = await this._documentService.downloadPdf(id);
          } else {
            console.log('[Viewer] Triggering downloadPdf (GET) directly...');
            blob = await this._documentService.downloadPdf(id);
          }

          fileURL = URL.createObjectURL(blob);
          this.rawPdfUrl.set(fileURL);
          if (isFinal) {
            this._documentService.setCachedPdf(id, blob, fileURL);
          }
        }

        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
      } else if (option.type === 'merged') {
        const id = option.id;
        console.log('[Viewer] Loading merged PDF for doc:', id);
        
        const cachedUrl = this._documentService.getCachedMergedPdf(id);
        let fileURL: string;
        
        if (cachedUrl) {
          console.log('[Viewer] Using cached merged PDF:', cachedUrl);
          fileURL = cachedUrl;
        } else {
          const blob = await this._documentService.downloadMergedPdf(id);
          fileURL = URL.createObjectURL(blob);
          this.rawPdfUrl.set(fileURL);
          this._documentService.setCachedMergedPdf(id, blob, fileURL);
        }

        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(fileURL));
      } else {
        console.log('[Viewer] Loading attachment PDF from AttachmentService...');
        const url = this._attachmentService.getDownloadUrl(option.id);
        console.log('[Viewer] Sanitizing download URL:', url);
        this.pdfViewerUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(url));
      }
    } catch (err: any) {
      console.error('[Viewer] Error loading PDF in visor:', err);
      let message = 'Ocurrió un error al cargar el visor de PDF. Por favor, intente de nuevo.';
      if (err?.error instanceof Blob) {
        try {
          const text = await err.error.text();
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {}
      } else if (err?.error?.message) {
        message = err.error.message;
      } else if (err?.message) {
        message = err.message;
      }
      alert(message);
    } finally {
      console.log('[Viewer] loadPdfForOption finished.');
      this.isLoadingPdf.set(false);
    }
  }

  clearPdfUrl() {
    const raw = this.rawPdfUrl();
    if (raw) {
      if (!this._documentService.isUrlCached(raw)) {
        URL.revokeObjectURL(raw);
      }
      this.rawPdfUrl.set(null);
    }
    this.pdfViewerUrl.set(null);
  }

  closeViewer() {
    window.close();
  }

  ngOnDestroy() {
    this.clearPdfUrl();
  }
}
