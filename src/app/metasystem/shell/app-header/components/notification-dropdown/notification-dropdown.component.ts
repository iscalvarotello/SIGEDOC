import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DropdownComponent } from '@system-shared/ui/dropdown/dropdown.component';
import { NotificationService } from '@services/notification.service';
import { NotificationDTO } from '@core/models/notification.dto';
import { SesionService } from '@services/sesion.service';
import { NotificationButtonComponent } from '@system-shared/buttons/notification-button/notification-button.component';
import { IconButtonComponent } from '@system-shared/buttons/icon-button/icon-button.component';
import { NotificationItemComponent } from '@system-shared/ui/notification-item/notification-item.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownComponent, NotificationButtonComponent, IconButtonComponent, NotificationItemComponent, TitleComponent]
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private sessionService = inject(SesionService);
  private router = inject(Router);

  isOpen = false;
  notifications = signal<NotificationDTO[]>([]);
  
  // Computamos las no leídas
  unreadCount = computed(() => this.notifications().filter(n => !n.leido).length);
  
  // Informa si hay notificaciones pendientes (para el ping naranja)
  notifying = computed(() => this.unreadCount() > 0);

  private pollingInterval?: any;

  ngOnInit() {
    if (this.sessionService.isLoggedIn()) {
      this.loadNotifications();
      this.startPolling();
    }
  }

  async loadNotifications() {
    const list = await this.notificationService.getNotifications(false); // Traer leídas y no leídas
    this.notifications.set(list);
  }

  startPolling() {
    // Polling cada 30 segundos en segundo plano
    this.pollingInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications(); // Carga fresca al abrir
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }

  async handleNotificationClick(notification: NotificationDTO) {
    // Cerrar el dropdown
    this.closeDropdown();

    try {
      // 1. Si no está leída, marcar como leída en backend de forma asíncrona
      if (!notification.leido) {
        // Marcamos como leído localmente de inmediato para mayor reactividad visual
        this.notifications.update(list => 
          list.map(n => n.id === notification.id ? new NotificationDTO({ ...n, leido: true, read_at: new Date() }) : n)
        );
        
        await this.notificationService.markAsRead(notification.id);
      }
      
      // 2. Redirección profunda al destino (path + query params)
      if (notification.path) {
        this.router.navigate([notification.path], {
          queryParams: notification.query_params
        });
      }
    } catch (err) {
      console.error('Error al procesar el click de la notificación:', err);
    }
  }

  async dismissNotification(notification: NotificationDTO) {
    // Actualización optimista de la UI: removemos de inmediato
    this.notifications.update(list => list.filter(n => n.id !== notification.id));

    try {
      await this.notificationService.dismiss(notification.id);
    } catch (err) {
      console.error('Error al descartar la notificación:', err);
      // Recargamos notificaciones en caso de falla para mantener sincronización
      this.loadNotifications();
    }
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
