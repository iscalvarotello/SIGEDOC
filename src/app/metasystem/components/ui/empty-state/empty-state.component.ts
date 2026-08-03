import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      @if (icon()) {
        <icon [icon]="icon()" class="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-3"></icon>
      }
      @if (title()) {
        <p class="text-sm font-medium text-gray-500 dark:text-zinc-400">{{ title() }}</p>
      }
      @if (description()) {
        <p class="text-xs text-gray-400 mt-1">{{ description() }}</p>
      }
      
      <!-- Slot for extra actions -->
      <div class="mt-4 empty:hidden">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class EmptyStateComponent {
  icon = input<string>('ArchiveAdd');
  title = input<string>('No hay elementos');
  description = input<string>('');
}
