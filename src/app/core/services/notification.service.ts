import { Injectable } from '@angular/core';
import { BaseApiService } from '../api/base-api.service';
import { ENDPOINT_KEYS } from '../api/api-routes.config';
import { NotificationDTO } from '../models/notification.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseApiService<NotificationDTO> {
  constructor() {
    super(ENDPOINT_KEYS.NOTIFICATIONS, NotificationDTO);
  }

  /**
   * Obtiene la lista de notificaciones para el usuario autenticado.
   * 
   * @param unreadOnly Si es true, retorna solo las notificaciones no leídas
   */
  async getNotifications(unreadOnly = false): Promise<NotificationDTO[]> {
    const params: any = { limit: 50 }; // Traemos un máximo de 50 para el dropdown
    if (unreadOnly) {
      params.unreadOnly = true;
    }
    try {
      const res = await this.getAll(params, undefined, true); // forceRefresh=true para no usar caché obsoleto
      return res.data || [];
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      return [];
    }
  }

  /**
   * Marca una notificación como leída en el backend.
   * 
   * @param id UUID de la notificación
   */
  async markAsRead(id: string): Promise<NotificationDTO> {
    return this.executeSpecialRoute('markAsRead', { id }, {});
  }

  /**
   * Descarta / Oculta una notificación de forma permanente de la UI.
   * 
   * @param id UUID de la notificación
   */
  async dismiss(id: string): Promise<NotificationDTO> {
    return this.executeSpecialRoute('dismiss', { id }, {});
  }
}
