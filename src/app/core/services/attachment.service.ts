import { Injectable } from '@angular/core';
import { BaseApiService } from '../api/base-api.service';
import { ENDPOINT_KEYS } from '../api/api-routes.config';
import { environment } from '../../../environments/environment';
import { extractFileExtension } from '@utils/file.utils';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService extends BaseApiService<any> {
  constructor() {
    super(ENDPOINT_KEYS.ATTACHMENTS);
  }

  async upload(file: File): Promise<{ id_attachment: string; filename: string; originalname: string; extension: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.executeSpecialRoute('upload', {}, formData);
  }

  async deleteAttachment(id: string): Promise<void> {
    return this.delete(id);
  }

  getDownloadUrl(id: string): string {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    return `${baseUrl}/attachments/${id}`;
  }

  getFileExtension(filenameOrExt: string): string {
    return extractFileExtension(filenameOrExt);
  }

  ensureDotExtension(filenameOrExt: string): string {
    if (!filenameOrExt) return '.pdf';
    const ext = this.getFileExtension(filenameOrExt);
    return ext ? `.${ext}` : '.pdf';
  }

  isPdf(filenameOrExt: string): boolean {
    return this.getFileExtension(filenameOrExt) === 'pdf';
  }

  getAttachmentColorClasses(filenameOrExt: string): string {
    const ext = this.getFileExtension(filenameOrExt);
    switch (ext) {
      case 'pdf':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'zip':
      case 'rar':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'docx':
      case 'doc':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'xlsx':
      case 'xls':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pptx':
      case 'ppt':
        return 'bg-orange-50 text-orange-650 border border-orange-100';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'tiff':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  }

  getAttachmentIcon(filenameOrExt: string): string {
    const ext = this.getFileExtension(filenameOrExt);
    switch (ext) {
      case 'pdf': return '📕';
      case 'zip':
      case 'rar': return '📦';
      case 'docx':
      case 'doc': return '📘';
      case 'xlsx':
      case 'xls': return '📗';
      case 'pptx':
      case 'ppt': return '📙';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'tiff': return '🖼️';
      default: return '📄';
    }
  }

  getAttachmentIconPath(filenameOrExt: string): string {
    const ext = this.getFileExtension(filenameOrExt);
    switch (ext) {
      case 'pdf': return '/images/png-icons/pdf.png';
      case 'docx':
      case 'doc': return '/images/png-icons/doc.png';
      case 'xlsx':
      case 'xls': return '/images/png-icons/xls.png';
      case 'pptx':
      case 'ppt': return '/images/png-icons/ppt.png';
      case 'png': return '/images/png-icons/png.png';
      case 'jpg': return '/images/png-icons/jpg.png';
      case 'jpeg': return '/images/png-icons/jpeg.png';
      case 'gif': return '/images/png-icons/gif.png';
      case 'tiff': return '/images/png-icons/tiff.png';
      case 'zip': return '/images/png-icons/zip.png';
      case 'rar': return '/images/png-icons/rar.png';
      default: return '/images/png-icons/doc.png';
    }
  }
}
