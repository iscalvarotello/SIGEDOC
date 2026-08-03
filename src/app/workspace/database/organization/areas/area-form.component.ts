import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { TenantService } from '@core/services/tenant.service';
import { AreaDTO } from './area.dto';
import { AreaService } from './area.service';
import { AREA_FORM_CONFIG } from './area-form.config';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent, ActionButtonComponent],
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
      [isFormInvalid]="false" [globalErrors]="globalErrors()" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">

      @if (!isLoading()) {
        <div class="flex justify-end mb-4 -mt-2">
          <action-button variant="outline" size="sm" label="Copiar Pie de Página de Institución" icon="Copy" (clicked)="copyInstitutionFooter()"></action-button>
        </div>
      }

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
  private tenantService = inject(TenantService);

  copyInstitutionFooter() {
    const tenant = this.tenantService.currentTenant();
    if (tenant && tenant.footer) {
      this.form.patchValue({ footer: tenant.footer });
      this.form.markAsDirty();
    } else {
      alert('La institución activa no tiene un pie de página configurado.');
    }
  }
}
