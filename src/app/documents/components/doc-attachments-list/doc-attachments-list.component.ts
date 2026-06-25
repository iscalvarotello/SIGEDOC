import { Component, Input, Output, EventEmitter, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { AttachmentService } from '../../../core/services/attachment.service';

@Component({
  selector: 'doc-attachments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doc-attachments-list.component.html',
})
export class DocAttachmentsListComponent {
  @Input() doc: any | null = null;
  @Input() isLoading = false;

  // Two-way binding for list of attachments
  attachments = model<any[]>([]);

  @Output() actionCompleted = new EventEmitter<void>();

  private _documentService = inject(DocumentService);
  private _attachmentService = inject(AttachmentService);

  isPdf(filenameOrExt: string): boolean {
    const name = (filenameOrExt || '').toLowerCase();
    return name.endsWith('.pdf') || name.endsWith('.PDF') || name.endsWith('.Pdf') || name.endsWith('.PDf') || name === 'pdf' || name === '.pdf';
  }

  getAttachmentColorClasses(filenameOrExt: string): string {
    const name = (filenameOrExt || '').toLowerCase();
    if (name.endsWith('.pdf') || name === 'pdf' || name === '.pdf') return 'bg-red-50 text-red-600 border border-red-100';
    if (name.endsWith('.zip') || name.endsWith('.rar') || name === 'zip' || name === 'rar') return 'bg-amber-50 text-amber-600 border border-amber-100';
    if (name.endsWith('.docx') || name.endsWith('.doc') || name === 'docx' || name === 'doc') return 'bg-blue-50 text-blue-600 border border-blue-100';
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name === 'xlsx' || name === 'xls') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    if (name.endsWith('.pptx') || name.endsWith('.ppt') || name === 'pptx' || name === 'ppt') return 'bg-orange-50 text-orange-600 border border-orange-100';
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.tiff')) return 'bg-purple-50 text-purple-600 border border-purple-100';
    return 'bg-gray-50 text-gray-600 border border-gray-100';
  }

  getAttachmentIcon(filenameOrExt: string): string {
    const name = (filenameOrExt || '').toLowerCase();
    if (name.endsWith('.pdf') || name === 'pdf' || name === '.pdf') return '📕';
    if (name.endsWith('.zip') || name.endsWith('.rar') || name === 'zip' || name === 'rar') return '📦';
    if (name.endsWith('.docx') || name.endsWith('.doc') || name === 'docx' || name === 'doc') return '📘';
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name === 'xlsx' || name === 'xls') return '📗';
    if (name.endsWith('.pptx') || name.endsWith('.ppt') || name === 'pptx' || name === 'ppt') return '📙';
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.tiff')) return '🖼️';
    return '📄';
  }

  getAttachmentIconPath(filenameOrExt: string): string {
    const name = (filenameOrExt || '').toLowerCase();
    if (name.endsWith('.pdf')  || name.endsWith('.PDF') || name.endsWith('.Pdf') || name.endsWith('.PDf') ) return '/images/png-icons/pdf.png';
    if (name.endsWith('.docx') || name.endsWith('.doc') || name.endsWith('.DOCX') || name.endsWith('.DOC')) return '/images/png-icons/doc.png';
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.XLSX') || name.endsWith('.XLS')) return '/images/png-icons/xls.png';
    if (name.endsWith('.pptx') || name.endsWith('.ppt') || name.endsWith('.PPTX') || name.endsWith('.PPT')) return '/images/png-icons/ppt.png';
    if (name.endsWith('.png')  || name.endsWith('.PNG') ) return '/images/png-icons/png.png';
    if (name.endsWith('.tiff') || name.endsWith('.TIFF')) return '/images/png-icons/tiff.png';
    if (name.endsWith('.jpg')  || name.endsWith('.JPEG')) return '/images/png-icons/jpeg.png';
    if (name.endsWith('.jpeg') || name.endsWith('.JPEG')) return '/images/png-icons/jpeg.png';
    if (name.endsWith('.gif')  || name.endsWith('.GIF') ) return '/images/png-icons/gif.png';
    if (name.endsWith('.zip')  || name.endsWith('.ZIP') ) return '/images/png-icons/zip.png';
    if (name.endsWith('.rar')  || name.endsWith('.RAR') ) return '/images/png-icons/rar.png';
    return '/images/png-icons/doc.png';
  }

  getAttachmentDownloadUrl(id: string): string {
    return this._attachmentService.getDownloadUrl(id);
  }

  async removeDocumentAttachment(id_attachment: string) {
    const doc = this.doc;
    if (!doc) return;

    if (!confirm('⚠️ ¿Estás seguro de desvincular este anexo del documento?')) {
      return;
    }

    try {
      const currentAttachments = this.attachments();
      const updatedAttachments = currentAttachments.filter((att: any) => att.id_attachment !== id_attachment);
      
      await this._documentService.updateAttachments(doc.id, updatedAttachments);
      this.attachments.set(updatedAttachments);
      alert('Anexo desvinculado con éxito.');
      this.actionCompleted.emit();
    } catch (error: any) {
      console.error('Error al eliminar anexo:', error);
      alert('Ocurrió un error al eliminar el anexo:\n' + (error?.error?.message || error?.message || 'Error desconocido'));
    }
  }

  async moveDocumentAttachment(index: number, direction: 'up' | 'down') {
    const doc = this.doc;
    if (!doc) return;

    const list = [...this.attachments()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

    try {
      await this._documentService.updateAttachments(doc.id, list.map(a => ({
        id_attachment: a.id_attachment,
        attachment_name: a.attachment_name,
        attachment_title: a.attachment_title,
        extension: a.extension,
      })));
      
      this.attachments.set(list);
      this.actionCompleted.emit();
    } catch (error: any) {
      console.error('Error al reordenar anexos:', error);
      alert('Ocurrió un error al reordenar los anexos:\n' + (error?.error?.message || error?.message || 'Error desconocido'));
    }
  }
}
