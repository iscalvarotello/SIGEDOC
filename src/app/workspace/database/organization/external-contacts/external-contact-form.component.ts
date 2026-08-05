import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { ExternalContactDTO } from './external-contact.dto';
import { ExternalContactService } from './external-contact.service';
import { EXTERNAL_CONTACT_FORM_CONFIG } from './external-contact-form.config';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-external-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, IconComponent, ActionButtonComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Editar Contacto Externo' : 'Nuevo Contacto Externo' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Complete el formulario para registrar o actualizar un contacto externo (Dependencias, ONG, etc.).
          </p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
        </div>
      } @else {
        @if (globalErrors().length > 0) {
          <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong class="font-bold">Error:</strong>
            <ul class="list-disc pl-5 mt-2">
              @for (error of globalErrors(); track $index) {
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
          <action-button variant="ghost" (clicked)="onCancel()" [label]="'Cancelar'"></action-button>
          <action-button variant="primary" (clicked)="onSave()">
            <icon icon="SaveDisk" class="w-4 h-4"></icon>
            Guardar Contacto
          </action-button>
        </div>
      }
    </div>
  `
})
export class ExternalContactFormComponent extends BaseFormController<ExternalContactDTO> {
  protected apiService = inject(ExternalContactService);
  protected controllerConfig = EXTERNAL_CONTACT_FORM_CONFIG;
}
