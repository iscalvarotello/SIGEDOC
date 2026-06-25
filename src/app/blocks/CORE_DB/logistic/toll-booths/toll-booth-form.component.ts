import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { TollBoothDTO } from './toll-booth.dto';
import { TollBoothService } from './toll-booth.service';
import { TOLL_BOOTH_FORM_CONFIG } from './toll-booth-form.config';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '../../../../shared/components/dynamic-form/form-page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-toll-booth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Nueva Caseta de Cobro"
      titleEdit="Editar Caseta de Cobro"
      [contextText]="contextText()"
      subtitle="Ingrese los costos y tarifas por eje."
      breadcrumbLabel="Casetas de Cobro"
      breadcrumbRoute="/database/logistic/toll-booths"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty && !isEditMode()"
      [isFormInvalid]="false" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">

      <app-dynamic-form 
        [config]="formConfig" 
        [formGroup]="form"
        [isEditMode]="isEditMode()">
      </app-dynamic-form>

    </app-form-page-wrapper>
  `
})
export class TollBoothFormComponent extends BaseFormController<TollBoothDTO> {
  protected apiService = inject(TollBoothService);
  protected controllerConfig = {
    mainRoute: '/database/logistic/toll-booths',
    formConfig: TOLL_BOOTH_FORM_CONFIG.formConfig
  };
}
