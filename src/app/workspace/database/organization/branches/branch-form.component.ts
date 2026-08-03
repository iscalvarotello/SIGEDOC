import { Component, inject } from '@angular/core';
import { CancelButtonComponent } from '@system-shared/buttons/index';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { BranchDTO } from './branch.dto';
import { BranchService } from './branch.service';
import { BRANCH_FORM_CONFIG } from './branch-form.config';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, IconComponent, CancelButtonComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Editar Sede Física' : 'Nueva Sede Física' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Complete el formulario para registrar o actualizar una sede en el sistema.
          </p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
        </div>
      } @else {
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
            Guardar Sede
          </button>
        </div>
      }
    </div>
  `
})
export class BranchFormComponent extends BaseFormController<BranchDTO> {
  protected apiService = inject(BranchService);
  protected controllerConfig = BRANCH_FORM_CONFIG;
}
