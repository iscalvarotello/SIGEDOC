import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '../../../../shared/components/dynamic-form/form-page-wrapper.component';
import { SupplierDTO } from './supplier.dto';
import { SupplierService } from './supplier.service';
import { SUPPLIER_FORM_CONFIG } from './supplier-form.config';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Crear Nuevo Proveedor"
      titleEdit="Editar Información del Proveedor"
      subtitle="Complete los datos comerciales y de contacto."
      breadcrumbLabel="Directorio de Proveedores"
      breadcrumbRoute="/database/organization/suppliers"
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
export class SupplierFormComponent extends BaseFormController<SupplierDTO> {
  protected apiService = inject(SupplierService);
  protected override controllerConfig = {
    mainRoute: '/database/organization/suppliers',
    cacheKeyToInvalidate: 'SUPPLIERS',
    formConfig: SUPPLIER_FORM_CONFIG
  };
}
