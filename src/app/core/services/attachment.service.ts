import { Injectable } from '@angular/core';
import { BaseApiService } from '../api/base-api.service';
import { ENDPOINT_KEYS } from '../api/api-routes.config';
import { environment } from '../../../environments/environment';

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
}
