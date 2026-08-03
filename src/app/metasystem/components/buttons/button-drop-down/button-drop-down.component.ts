import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button-drop-down',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="clicked.emit()"
      class="dropdown-toggle flex items-center px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 transition duration-150 shadow-theme-xs cursor-pointer border border-gray-200/50 dark:border-gray-700/50"
      [ngClass]="inline() ? 'gap-1.5 uppercase' : 'gap-3 text-left'"
    >
      <!-- Icon Section -->
      @if (icon() === 'circulo_verde') {
        <span class="inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse shrink-0"></span>
      } @else if (icon()) {
        <span class="shrink-0" [innerHTML]="icon()"></span>
      }

      <!-- Text Section -->
      @if (inline()) {
        <span class="truncate">
          {{ title() }} <b class="text-theme-primary dark:text-theme-primary/80">{{ subtitle() }}</b>
        </span>
      } @else {
        <div class="flex flex-col min-w-0">
          <span class="text-gray-900 dark:text-white truncate block">{{ title() }}</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 font-normal truncate block">{{ subtitle() }}</span>
        </div>
      }

      <!-- Arrow Icon -->
      <svg
        [ngClass]="{'rotate-180': isOpen()}"
        class="h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ml-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ButtonDropDownComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  inline = input<boolean>(true);
  icon = input<string>(''); // e.g. 'circulo_verde'
  isOpen = input<boolean>(false);

  clicked = output<void>();
}
