import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button-bandeja',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="clicked.emit()"
      [ngClass]="active() 
        ? 'bg-blue-50/50 border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800' 
        : 'bg-white border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750'"
      class="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left group"
    >
      <div class="flex-1 truncate mr-2">
        <span [ngClass]="active() ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'" class="block truncate text-sm font-bold mb-0.5 transition-colors">
          {{ title() }}
        </span>
        <span [ngClass]="active() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" class="block text-[10.5px] font-medium truncate transition-colors leading-tight">
          {{ subtitle() }}
        </span>
      </div>
      @if (badge()) {
        <span 
          [ngClass]="active() ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'"
          class="flex-shrink-0 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border transition-colors"
        >
          {{ badge() }}
        </span>
      }
    </button>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class ButtonBandejaComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  badge = input<string>();
  active = input<boolean>(false);
  clicked = output<void>();
}
