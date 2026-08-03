import { Component, inject } from '@angular/core';
import { CancelButtonComponent } from '@system-shared/buttons/index';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { ProjectDTO } from './project.dto';
import { ProjectService } from './project.service';
import { PROJECT_FORM_CONFIG } from './project-form.config';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, IconComponent, CancelButtonComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Complete el formulario para registrar o actualizar un proyecto institucional o de inversión.
          </p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
        </div>
      } @else {
        @if (globalErrors().length > 0) {
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in-up">
            <h4 class="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
              <icon icon="ErrorCircle" class="w-4 h-4"></icon>
              No se pudo guardar el registro
            </h4>
            <ul class="text-sm text-red-700 list-disc list-inside space-y-1">
              @for (error of globalErrors(); track error) {
                <li>{{ error }}</li>
              }
            </ul>
          </div>
        }

        <app-dynamic-form 
          [config]="formConfig" 
          [formGroup]="form"
          [isEditMode]="isEditMode()">
        </app-dynamic-form>

        <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
          <cancel-button (clicked)="onCancel()" label="Cancelar"></cancel-button>
          <button 
            type="button" 
            (click)="onSave()"
            
            class="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary hover:bg-[#5a1528]   rounded-lg shadow-sm transition-all flex items-center gap-2">
            <icon icon="SaveDisk" class="w-4 h-4"></icon>
            Guardar Proyecto
          </button>
        </div>
      }
    </div>
  `
})
export class ProjectFormComponent extends BaseFormController<ProjectDTO> {
  protected apiService = inject(ProjectService);
  protected controllerConfig = PROJECT_FORM_CONFIG;
}
