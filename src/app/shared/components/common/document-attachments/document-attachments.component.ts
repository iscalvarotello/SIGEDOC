import { Component, model, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttachmentService } from '../../../../core/services/attachment.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SupplierSelectComponent } from '../supplier-select/supplier-select.component';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

export interface Anexo {
  id_attachment: string;
  attachment_name: string;
  attachment_title: string;
  extension?: string;
  source_type?: 'supplier' | 'pure';
  source_name?: string;
}

@Component({
  selector: 'app-document-attachments',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, SupplierSelectComponent, FileUploaderComponent],
  templateUrl: './document-attachments.component.html'
})
export class DocumentAttachmentsComponent {
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

  // Model binding para emitir y recibir los anexos
  anexos = model<Anexo[]>([]);

  // Modales de Anexos
  isSupplierModalOpen = signal<boolean>(false);
  selectedSupplierForModalObj = signal<any>(null);
  selectedSupplierIdForModal = signal<string>('');
  supplierAttachmentsList = signal<any[]>([]);
  selectedSupplierAttachmentsIds = signal<Record<string, boolean>>({});
  isLoadingSupplierAttachments = signal<boolean>(false);

  isPureAttachmentModalOpen = signal<boolean>(false);
  pureAttTitle = signal<string>('');
  pureAttName = signal<string>('');
  pureSelectedFile = signal<File | null>(null);
  isUploadingPureFile = signal<boolean>(false);

  openSupplierModal() {
    this.selectedSupplierForModalObj.set(null);
    this.selectedSupplierIdForModal.set('');
    this.supplierAttachmentsList.set([]);
    this.selectedSupplierAttachmentsIds.set({});
    this.isSupplierModalOpen.set(true);
  }

  closeSupplierModal() {
    this.isSupplierModalOpen.set(false);
  }

  onSupplierForAttachmentChange(sup: any) {
    if (!sup) {
      this.selectedSupplierForModalObj.set(null);
      this.selectedSupplierIdForModal.set('');
      this.supplierAttachmentsList.set([]);
      this.selectedSupplierAttachmentsIds.set({});
      return;
    }
    this.selectedSupplierForModalObj.set(sup);
    this.selectedSupplierIdForModal.set(sup.id);
    
    // Filter attachments: !versionable OR (versionable AND year === currentYear)
    const currentYear = new Date().getFullYear();
    const filtered = (sup.attachments || []).filter((att: any) => 
      !att.versionable || (att.versionable && att.year === currentYear)
    );
    this.supplierAttachmentsList.set(filtered);
    this.selectedSupplierAttachmentsIds.set({});
  }

  toggleSupplierAttachmentSelection(id: string) {
    this.selectedSupplierAttachmentsIds.update(current => {
      const copy = { ...current };
      copy[id] = !copy[id];
      return copy;
    });
  }

  addSelectedSupplierAttachments() {
    const selectedIds = this.selectedSupplierAttachmentsIds();
    const attachmentsToAdd = this.supplierAttachmentsList().filter(att => selectedIds[att.id_attachment]);
    const currentSupplier = this.selectedSupplierForModalObj();
    const supplierName = currentSupplier ? (currentSupplier.razon_social || currentSupplier.name) : 'Proveedor';

    this.anexos.update(list => {
      const newList = [...list];
      for (const att of attachmentsToAdd) {
        if (!newList.some(item => item.id_attachment === att.id_attachment)) {
          newList.push({
            id_attachment: att.id_attachment,
            attachment_name: att.attachment_name,
            attachment_title: att.attachment_title,
            extension: att.extension,
            source_type: 'supplier',
            source_name: supplierName
          });
        }
      }
      return newList;
    });

    this.closeSupplierModal();
  }

  openPureAttachmentModal() {
    this.pureAttTitle.set('');
    this.pureAttName.set('');
    this.pureSelectedFile.set(null);
    this.isUploadingPureFile.set(false);
    this.isPureAttachmentModalOpen.set(true);
  }

  closePureAttachmentModal() {
    this.isPureAttachmentModalOpen.set(false);
  }

  onPureFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.jpg', '.jpeg', '.png', '.gif', '.tiff'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert('Formato de archivo no permitido. Los formatos aceptados son: ' + ALLOWED_EXTENSIONS.join(', '));
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo supera el límite de 10MB');
      event.target.value = '';
      return;
    }

    this.pureSelectedFile.set(file);
    if (!this.pureAttName()) {
      this.pureAttName.set(file.name);
    }

    // Clear input value to allow selecting same file again
    event.target.value = '';
  }

  onPureFileUploaded(file: File) {
    this.pureSelectedFile.set(file);
    if (!this.pureAttName()) {
      this.pureAttName.set(file.name);
    }
  }

  async uploadAndAddPureAttachment() {
    const file = this.pureSelectedFile();
    if (!file) {
      alert('Debe seleccionar un archivo');
      return;
    }

    this.isUploadingPureFile.set(true);
    try {
      const uploadRes = await this._attachmentService.upload(file);
      
      this.anexos.update(list => [
        ...list,
        {
          id_attachment: uploadRes.id_attachment,
          attachment_name: this.pureAttTitle() || 'Anexo Directo',
          attachment_title: this.pureAttName() || uploadRes.originalname,
          extension: uploadRes.extension,
          source_type: 'pure'
        }
      ]);

      this.closePureAttachmentModal();
    } catch (error: any) {
      console.error('Error al subir el archivo:', error);
      alert('Ocurrió un error al subir el archivo:\\n' + (error?.error?.message || error?.message || 'Error desconocido'));
    } finally {
      this.isUploadingPureFile.set(false);
    }
  }

  async removeDocumentAttachment(index: number, id_attachment: string) {
    const target = this.anexos()[index];
    if (!target) return;

    // Remove from local list
    this.anexos.update(list => list.filter((_, i) => i !== index));

    // If it was a newly uploaded pure attachment, delete physically
    if (target.source_type === 'pure') {
      try {
        await this._attachmentService.deleteAttachment(id_attachment);
      } catch (err) {
        console.error('No se pudo eliminar el anexo físicamente del servidor:', err);
      }
    }
  }

  moveAttachment(index: number, direction: 'up' | 'down') {
    const list = [...this.anexos()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
    this.anexos.set(list);
  }

  getAttachmentDownloadUrl(id: string): string {
    return this._attachmentService.getDownloadUrl(id);
  }
}
