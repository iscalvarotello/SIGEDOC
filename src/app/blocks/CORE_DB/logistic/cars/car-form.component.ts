import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@app/shared/classes/base-form.controller';
import { CarDTO } from './car.dto';
import { CarService } from './car.service';
import { CAR_FORM_CONFIG } from './car-form.config';
import { DynamicFormComponent } from '@app/shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@app/shared/components/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Nuevo Vehículo"
      titleEdit="Editar Vehículo"
      [contextText]="contextText()"
      subtitle="Complete los detalles del vehículo para el parque vehicular."
      breadcrumbLabel="Parque Vehicular"
      breadcrumbRoute="/database/logistic/cars"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty && !isEditMode()"
      [isFormInvalid]="false" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">

      <app-dynamic-form 
        [config]="controllerConfig.formConfig" 
        [formGroup]="form"
        [isEditMode]="isEditMode()">
      </app-dynamic-form>

    </app-form-page-wrapper>
  `
})
export class CarFormComponent extends BaseFormController<CarDTO> {
  protected override apiService = inject(CarService);
  protected override controllerConfig = CAR_FORM_CONFIG;
}
