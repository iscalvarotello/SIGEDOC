import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SVG_ICONS } from '../../icons/svg-icons';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-master-wrapper',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="h-[calc(100vh-100px)] flex flex-col p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Título y Botón Superior -->
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl" *ngIf="icon()">{{ icon() }}</span> {{ title() }}
        </h1>
        <div class="flex gap-2">
          <button 
            (click)="onRefresh.emit()"
            title="Refrescar vista actual"
            class="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 p-2.5 rounded-lg shadow-sm transition-colors border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <span class="text-xl leading-none flex items-center justify-center" [innerHTML]="iconRefresh | safeHtml"></span>
          </button>
          <button 
            (click)="onSync.emit()"
            title="Reconstruir (Limpiar Caché)"
            class="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 p-2.5 rounded-lg shadow-sm transition-colors border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <span class="text-xl leading-none flex items-center justify-center" [innerHTML]="iconSync | safeHtml"></span>
          </button>
          
          <!-- Slot para controles o botones adicionales -->
          <ng-content select="[customControls]"></ng-content>
          
          <button 
            (click)="onNew.emit()"
            [disabled]="disableNew() || !sesionService.canUpdateCurrentRoute(router.url) || !!serverError()"
            [ngClass]="{'opacity-50 cursor-not-allowed': disableNew() || !sesionService.canUpdateCurrentRoute(router.url) || !!serverError()}"
            class="bg-[#691C32] hover:bg-[#521526] text-white px-4 py-2 rounded-lg shadow-md font-medium transition-colors ml-2 flex items-center gap-1">
            <span>+</span> {{ newButtonLabel() }}
          </button>
        </div>
      </div>

      <!-- Master Detail Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        <!-- LADO IZQUIERDO: Master (Lista) -->
        <div 
          [style.grid-column]="'span ' + layoutSpan().master + ' / span ' + layoutSpan().master"
          class="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-0 transition-all duration-300">
          
          <!-- Buscador Fijo Arriba y Filtros Custom -->
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0 flex flex-col sm:flex-row gap-4 items-center">
            <div class="relative flex-1 w-full">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400" [innerHTML]="iconLupa | safeHtml"></span>
              <input 
                type="text" 
                [ngModel]="searchTerm()"
                (ngModelChange)="onSearch.emit($event)"
                [placeholder]="searchPlaceholder()" 
                class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 dark:bg-gray-900 dark:text-white transition-all shadow-sm"
              >
            </div>
            
            <!-- Slot para filtros adicionales -->
            <ng-content select="[customFilters]"></ng-content>
          </div>

          <!-- Contenedor Master (Tabla) -->
          <div class="flex-1 overflow-auto relative">
            @if (serverError()) {
              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-white dark:bg-gray-800">
                <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <svg width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-10 h-10"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Problema de Conexión</h3>
                <p class="text-base text-gray-500 dark:text-gray-400 max-w-sm">{{ serverError() }}</p>
                <button (click)="onRefresh.emit()" class="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors">
                  Reintentar
                </button>
              </div>
            }
            <ng-content select="[master]"></ng-content>
          </div>
        </div>

        <!-- LADO DERECHO: Detail (Panel) -->
        <div 
          [style.grid-column]="'span ' + layoutSpan().detail + ' / span ' + layoutSpan().detail"
          class="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-0 transition-all duration-300">
          <ng-content select="[detail]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class MasterWrapperComponent {
  sesionService = inject(SesionService);
  router = inject(Router);

  title = input.required<string>();
  icon = input<string>('');
  layoutSpan = input<{ master: number, detail: number }>({ master: 8, detail: 4 });
  searchTerm = input<string>('');
  searchPlaceholder = input<string>('Buscar...');
  newButtonLabel = input<string>('Nuevo');
  disableNew = input<boolean>(false);
  serverError = input<string | null>(null);

  onSearch = output<string>();
  onNew = output<void>();
  onRefresh = output<void>();
  onSync = output<void>();

  iconLupa = SVG_ICONS.Lupa;
  iconRefresh = SVG_ICONS.Refresh;
  iconSync = SVG_ICONS.Sincronizar;
}
