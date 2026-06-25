import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-page-wrapper',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen">
      
      <!-- Breadcrumbs / Navegación Superior -->
      <div class="mb-6 flex items-center text-sm text-gray-500 font-medium">
        <a [routerLink]="breadcrumbRoute()" [queryParams]="breadcrumbQueryParams()" class="hover:text-[#691C32] transition-colors cursor-pointer flex items-center gap-1">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
          {{ breadcrumbLabel() }}
        </a>
        <span class="mx-2">/</span>
        <span class="text-gray-900 dark:text-white">{{ isEditMode() ? titleEdit() : titleNew() + (contextText() ? ' ' + contextText() : '') }}</span>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        
        <!-- Encabezado del Formulario -->
        <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? titleEdit() : titleNew() }}
            @if (!isEditMode() && contextText()) {
              <span class="text-[#691C32] dark:text-[#BC955C] font-semibold">{{ ' ' + contextText() }}</span>
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
                <button 
                  type="button" 
                  (click)="onCancel.emit()"
                  [disabled]="isLoading()"
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                  Cancelar
                </button>
                
                <button 
                  type="button" 
                  (click)="onSave.emit()"
                  [disabled]="isLoading() || isFormInvalid()"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-[#691C32] border border-transparent rounded-lg hover:bg-[#521526] transition-colors shadow-md shadow-[#691C32]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  
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
  
  isEditMode = input<boolean>(false);
  isLoading = input<boolean>(false);
  showSkeleton = input<boolean>(false); // Para mostrar el skeleton solo en carga inicial
  isFormInvalid = input<boolean>(false); 

  onSave = output<void>();
  onCancel = output<void>();
}
