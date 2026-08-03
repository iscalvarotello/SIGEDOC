import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/index';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule      } from '@angular/common';
import { AttachmentService } from '@core/services/attachment.service';
import { } from '@system-shared/common/icon/icon.component';
import { } from '@system-shared/buttons/action-button/action-button.component';

export interface AttachmentItem {
  id_attachment: string;
  attachment_name: string;
  attachment_title: string;
  extension?: string;
  year?: number;
  versionable?: boolean;
  bandeja?: string;
}

@Component({
  selector: 'app-attachment-list',
  standalone: true,
  imports: [ActionButtonComponent, IconComponent, CommonModule],
  templateUrl: './attachment-list.component.html'
})
export class AttachmentListComponent {
  @Input() title: string = 'Anexos y DocumentaciÃ³n';
  @Input() attachments: AttachmentItem[] = [];
  @Input() isLoading: boolean = false;
  
  // Customization
  @Input() bgClass: string = 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-200/80 dark:border-gray-700/80 shadow-sm';
  @Input() widthClass: string = 'w-full';
  @Input() emptyMessage: string = 'No hay anexos';
  
  // Features
  @Input() allowReorder: boolean = true;
  @Input() allowDelete: boolean = true;
  @Input() allowAdd: boolean = false;

  @Output() onDelete = new EventEmitter<string>();
  @Output() onReorder = new EventEmitter<AttachmentItem[]>();
  @Output() onAdd = new EventEmitter<void>();

  public attachmentService = inject(AttachmentService);

  getAttachmentDownloadUrl(id: string): string {
    return this.attachmentService.getDownloadUrl(id);
  }

  isViewable(att: AttachmentItem): boolean {
    const extStr = att.extension || att.attachment_name;
    if (!extStr) return true; // Asumimos PDF por defecto
    
    // Si no tiene punto, asumimos PDF
    if (!extStr.includes('.')) return true;

    const ext = extStr.split('.').pop()?.toLowerCase() || '';
    const viewableExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg'];
    
    return viewableExtensions.includes(ext);
  }

  handleDelete(id: string) {
    if (confirm('âš ï¸ Â¿EstÃ¡s seguro de eliminar este anexo?')) {
      this.onDelete.emit(id);
    }
  }

  moveAttachment(index: number, direction: 'up' | 'down') {
    const list = [...this.attachments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
    
    // Emit the new order so the parent can save it
    this.onReorder.emit(list);
  }
}

