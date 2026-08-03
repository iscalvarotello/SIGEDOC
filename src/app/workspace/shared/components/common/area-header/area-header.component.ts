import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (area()) {
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 animate-fadeIn">
        <div class="flex flex-col gap-1 w-full">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {{ (area()?.area_type || 'Área') + (area()?.connector ? ' ' + area()?.connector : '') }}
            </span>
            @if (area()?.acronym) {
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-theme-primary/10 text-theme-primary">
                {{ area()?.acronym }}
              </span>
            }
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {{ area()?.name }}
          </h2>
          <p class="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
            <span>🏢 Sucursal: {{ area()?.branch || 'Edificio Central' }}</span>
            <span>•</span>
            <span>📍 Ciudad: {{ area()?.city }}, {{ area()?.state }}</span>
          </p>
        </div>
      </div>
    }
  `
})
export class AreaHeaderComponent {
  area = input<any | null>(null);
}
