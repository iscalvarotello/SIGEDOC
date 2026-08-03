import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDTO } from '@core/models/notification.dto';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'notification-item',
  standalone: true,
  imports: [CommonModule, IconComponent, ActionButtonComponent],
  template: `
    <li 
      class="relative group w-full text-left text-sm text-gray-700 flex gap-3 border-b border-gray-150 p-3 px-4.5 py-3 dark:border-gray-800 transition-colors cursor-pointer"
      [ngClass]="{ 
        'bg-orange-50/20 dark:bg-orange-950/10 hover:bg-orange-50/40 dark:hover:bg-orange-950/20': !notification().leido,
        'hover:bg-gray-50 dark:hover:bg-white/5': notification().leido
      }"
      (click)="clicked.emit(notification())"
    >
      <!-- Punto azul de no leído -->
      @if (!notification().leido) {
        <span class="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-sm animate-pulse"></span>
      }
      
      <!-- Iniciales del remitente -->
      <span class="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold shrink-0 text-xs uppercase dark:bg-gray-800 dark:text-gray-300">
        {{ notification().senderName.slice(0, 2) }}
      </span>
      
      <span class="block flex-1 min-w-0 pr-12">
        <span class="mb-0.5 block text-theme-sm font-bold text-gray-800 dark:text-gray-100 truncate" [title]="notification().titulo">
          {{ notification().titulo }}
        </span>
        <span class="mb-1.5 block text-theme-xs text-gray-500 dark:text-gray-400 break-words leading-relaxed">
          {{ notification().mensaje }}
        </span>
        <span class="flex items-center gap-1 text-gray-400 text-[10px] dark:text-gray-500 font-semibold">
          <icon icon="ClockOutline" class="w-3.5 h-3.5"></icon>
          <span>{{ notification().timeAgo }}</span>
        </span>
      </span>

      <!-- Botón de descarte "Ok" -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <action-button 
          variant="primary" 
          type="button" 
          (clicked)="onDismiss($event)" 
          label="Ok">
        </action-button>
      </div>
    </li>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class NotificationItemComponent {
  notification = input.required<NotificationDTO>();
  
  clicked = output<NotificationDTO>();
  dismissed = output<NotificationDTO>();

  onDismiss(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.dismissed.emit(this.notification());
  }
}
