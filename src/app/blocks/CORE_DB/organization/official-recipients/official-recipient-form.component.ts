import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { OfficialRecipientDTO } from './official-recipient.dto';
import { OfficialRecipientService } from './official-recipient.service';
import { OFFICIAL_RECIPIENT_FORM_CONFIG } from './official-recipient-form.config';

@Component({
  selector: 'app-official-recipient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Editar Destinatario Oficial' : 'Nuevo Destinatario Oficial' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Complete el formulario para registrar o actualizar un destinatario oficial en el sistema.
          </p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#691C32]"></div>
        </div>
      } @else {
        <app-dynamic-form 
          [config]="formConfig" 
          [formGroup]="form"
          [isEditMode]="isEditMode()">
        </app-dynamic-form>

        <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button" 
            (click)="onCancel()"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            type="button" 
            (click)="onSave()"
            [disabled]="form.invalid"
            class="px-5 py-2.5 text-sm font-medium text-white bg-[#691C32] hover:bg-[#5a1528] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center gap-2">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Guardar Destinatario
          </button>
        </div>
      }
    </div>
  `
})
export class OfficialRecipientFormComponent extends BaseFormController<OfficialRecipientDTO> {
  protected apiService = inject(OfficialRecipientService);
  protected controllerConfig = OFFICIAL_RECIPIENT_FORM_CONFIG;
}
