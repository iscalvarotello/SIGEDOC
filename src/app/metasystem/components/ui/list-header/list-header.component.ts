import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
      <div class="flex flex-col min-w-0">
        <h3 class="text-sm font-bold text-gray-800 dark:text-zinc-100 truncate block">{{ title() }}</h3>
        @if (subtitle()) {
          <p class="text-xs text-gray-500 dark:text-zinc-400 truncate block">{{ subtitle() }}</p>
        }
      </div>
      
      <!-- Slot for action buttons (like a plus button) -->
      <div class="shrink-0 flex items-center empty:hidden ml-4">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class ListHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}
