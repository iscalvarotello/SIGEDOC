import { Component, input, output, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CancelButtonComponent } from '@system-shared/buttons/index';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-form-page-wrapper',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, CancelButtonComponent],
  template: `
    <div [class]="maxWidth() + ' mx-auto p-6 min-h-screen'">
      
      <!-- Breadcrumbs / Navegación Superior -->
      <div class="mb-6 flex items-center text-sm text-gray-500 font-medium">
        <a [routerLink]="breadcrumbRoute()" [queryParams]="breadcrumbQueryParams()" class="hover:text-theme-primary transition-colors cursor-pointer flex items-center gap-1">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
          {{ breadcrumbLabel() }}
        </a>
        <span class="mx-2">/</span>
        <span class="text-gray-900 dark:text-white">{{ isEditMode() ? titleEdit() : titleNew() + (contextText() ? ' ' + contextText() : '') }}</span>
      </div>

      <!-- Banner de Errores Globales (Auto-foco) -->
      @if (globalErrors().length > 0) {
        <div #errorBanner tabindex="-1" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-shadow shadow-sm animate-fade-in-up">
          <icon icon="ErrorCircle" class="w-5 h-5 text-red-600 mt-0.5 shrink-0"></icon>
          <div>
            <h3 class="text-sm font-bold text-red-800">Se encontraron problemas al guardar:</h3>
            <ul class="mt-1 text-sm text-red-700 list-disc list-inside space-y-1">
              @for (err of globalErrors(); track err) {
                <li>{{ err }}</li>
              }
            </ul>
          </div>
        </div>
      }

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        
        <!-- Encabezado del Formulario -->
        <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? titleEdit() : titleNew() }}
            @if (!isEditMode() && contextText()) {
              <span class="text-theme-primary dark:text-theme-secondary font-semibold">{{ ' ' + contextText() }}</span>
            }
          </h1>
          @if (subtitle()) {
            <p class="mt-1 text-sm text-gray-500">
              {{ subtitle() }}
            </p>
          }
        </div>

        <!-- Cuerpo Dinámico -->
        <div class="flex-1">
          <!-- Skeleton Loading de Edición -->
          @if (isLoading() && isEditMode() && showSkeleton()) {
            <div class="p-8 space-y-8 animate-pulse">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div class="grid grid-cols-2 gap-6">
                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          } @else {
            <div class="p-8">
              <!-- El contenido del formulario va aquí -->
              <ng-content></ng-content>
              
              <!-- Acciones del Formulario -->
              <div class="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4 mt-10">
                <cancel-button (clicked)="onCancel.emit()" [disabled]="isLoading()" label="Cancelar"></cancel-button>
                
                <button 
                  type="button" 
                  (click)="onSave.emit()"
                  [disabled]="isLoading() || isFormInvalid()"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary border border-transparent rounded-lg hover:bg-[#521526] transition-colors shadow-md shadow-theme-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  
                  @if (isLoading()) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  } @else {
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Guardar
                  }
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class FormPageWrapperComponent {
  titleNew = input.required<string>();
  titleEdit = input.required<string>();
  subtitle = input<string>('');
  contextText = input<string>('');
  
  breadcrumbLabel = input.required<string>();
  breadcrumbRoute = input.required<string>();
  breadcrumbQueryParams = input<any>(null);
  
  maxWidth = input<string>('max-w-4xl');

  isEditMode = input<boolean>(false);
  isLoading = input<boolean>(false);
  showSkeleton = input<boolean>(false); // Para mostrar el skeleton solo en carga inicial
  isFormInvalid = input<boolean>(false); 
  globalErrors = input<string[]>([]);

  errorBanner = viewChild<ElementRef>('errorBanner');

  onSave = output<void>();
  onCancel = output<void>();

  constructor() {
    effect(() => {
      // Si hay errores globales, enfocar el banner después de que se renderice
      if (this.globalErrors().length > 0) {
        setTimeout(() => {
          this.errorBanner()?.nativeElement?.focus();
        }, 50);
      }
    });
  }
}
