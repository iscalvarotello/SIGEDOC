import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <!-- Estado de Carga Premium -->
      <div class="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
        <svg class="animate-spin h-5 w-5 text-[#691C32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xs">{{ loadingMessage() }}</span>
      </div>
    } @else if (isEmpty()) {
      <!-- Estado Vacío Premium y Adaptativo -->
      <div class="border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
        <span>{{ emptyMessage() }}</span>
        <!-- Slot Proyectable para Acciones del Estado Vacío -->
        <ng-content select="[emptyAction]"></ng-content>
      </div>
    } @else {
      <!-- Contenido Principal Proyectado (ej: Grid de Tarjetas) -->
      <ng-content></ng-content>
    }
  `
})
export class CardListComponent {
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
  loadingMessage = input<string>('Cargando elementos...');
  emptyMessage = input<string>('No hay elementos disponibles.');
}
