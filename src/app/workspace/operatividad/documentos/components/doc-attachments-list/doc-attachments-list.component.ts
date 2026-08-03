import { Component, Input, Output, EventEmitter, inject, model } from '@angular/core';
import { IconComponent } from '@system-shared/common/icon/icon.component';

import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { AttachmentService } from '@core/services/attachment.service';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SmartImageComponent } from '@system-shared/images/index';
import { SectionCardComponent } from '@system-shared/ui/section-card/section-card.component';

@Component({
  selector: 'doc-attachments-list',
  standalone: true,
  imports: [IconComponent, CommonModule, ActionButtonComponent, SmartImageComponent, SectionCardComponent],
  templateUrl: './doc-attachments-list.component.html',
})
export class DocAttachmentsListComponent {
  @Input() isLoading = false;
  @Input() canViewDownload = false;
  @Input() canDelete = false;
  @Input() canReorder = false;
  @Input() isConsolidated = false;

  // Two-way binding for list of attachments
  attachments = model<any[]>([]);

  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onReorder = new EventEmitter<{index: number, direction: 'up' | 'down'}>();
  @Output() onDownload = new EventEmitter<string>();

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

  viewAttachment(id: string) {
    this.onView.emit(id);
  }

  downloadAttachment(id: string) {
    this.onDownload.emit(id);
  }

  removeDocumentAttachment(id_attachment: string) {
    this.onDelete.emit(id_attachment);
  }

  moveDocumentAttachment(index: number, direction: 'up' | 'down') {
    this.onReorder.emit({ index, direction });
  }
}
