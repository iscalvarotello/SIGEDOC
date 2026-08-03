import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'notification-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [title]="title()"
      (click)="clicked.emit($event)"
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white active:scale-95 shadow-sm"
      [attr.aria-label]="title()">
      
      <!-- Badge indicador de pendientes con animación ping -->
      @if (notifying()) {
        <span class="absolute -top-0.5 -right-0.5 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-black leading-none border border-white dark:border-gray-900 shadow-sm">
          <span class="absolute inline-flex w-full h-full bg-orange-500 rounded-full opacity-75 animate-ping"></span>
          <span class="relative z-20">{{ displayCount() }}</span>
        </span>
      }
      
      <icon [icon]="icon()" class="fill-current w-5 h-5"></icon>
    </button>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class NotificationButtonComponent {
  unreadCount = input<number>(0);
  icon = input<string>('BellSolid');
  title = input<string>('Notificaciones');
  
  clicked = output<MouseEvent>();

  notifying = computed(() => this.unreadCount() > 0);
  
  // Format the count (e.g., 99+)
  displayCount = computed(() => {
    const count = this.unreadCount();
    return count > 99 ? '99+' : count.toString();
  });
}
