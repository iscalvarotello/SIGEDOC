import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dismiss-areacard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 dark:text-gray-600 animate-pulse">
        @if (iconType() === 'folder') {
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
        } @else {
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        }
      </div>
      <div class="max-w-md flex flex-col gap-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ title() }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ description() }}
        </p>
      </div>
    </div>
  `
})
export class DismissAreacardComponent {
  title = input<string>('Ningún área seleccionada');
  description = input<string>('Por favor, elija una de las áreas en el organigrama lateral izquierdo para visualizar.');
  iconType = input<'users' | 'folder'>('users');
}
