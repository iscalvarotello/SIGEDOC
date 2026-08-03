import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (isLoading()) {
      <!-- Estado de Carga Premium -->
      <div class="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
        <icon icon="Spinner" class="h-5 w-5 text-theme-primary animate-spin"></icon>
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
