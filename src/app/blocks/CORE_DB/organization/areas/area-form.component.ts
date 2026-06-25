import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '../../../../shared/components/dynamic-form/form-page-wrapper.component';
import { AreaDTO } from './area.dto';
import { AreaService } from './area.service';
import { AREA_FORM_CONFIG } from './area-form.config';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Crear Nueva Área"
      titleEdit="Editar Área Administrativa"
      subtitle="Complete los datos para configurar el área en la estructura organizacional."
      breadcrumbLabel="Áreas Administrativas"
      breadcrumbRoute="/database/organization/areas"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty"
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
export class AreaFormComponent extends BaseFormController<AreaDTO> {
  protected apiService = inject(AreaService);
  protected controllerConfig = AREA_FORM_CONFIG;
}
