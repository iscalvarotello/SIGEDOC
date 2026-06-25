import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '../../../../shared/components/dynamic-form/form-page-wrapper.component';
import { FuelStationDTO } from './fuel-station.dto';
import { FuelStationService } from './fuel-station.service';
import { FUEL_STATION_FORM_CONFIG } from './fuel-station-form.config';

@Component({
  selector: 'app-fuel-station-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Nueva Estación de Gasolina"
      titleEdit="Editar Estación de Gasolina"
      subtitle="Ingrese los datos de la sucursal del proveedor de combustible."
      breadcrumbLabel="Catálogo de Gasolinerías"
      breadcrumbRoute="/database/organization/fuel-stations"
      [contextText]="contextText()"
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
export class FuelStationFormComponent extends BaseFormController<FuelStationDTO> {
  protected apiService = inject(FuelStationService);
  private currentRoute = inject(ActivatedRoute);

  protected override controllerConfig = {
    mainRoute: '/database/organization/fuel-stations',
    cacheKeyToInvalidate: 'FUEL_STATIONS',
    formConfig: FUEL_STATION_FORM_CONFIG
  };

  override async ngOnInit() {
    await super.ngOnInit();
    
    // Si estamos creando uno nuevo, leer el supplier_id de la URL e inyectarlo
    if (!this.isEditMode()) {
      const supplierId = this.currentRoute.snapshot.queryParamMap.get('supplier_id');
      if (supplierId) {
        this.form.patchValue({ supplier_id: supplierId });
      }
    }
  }
}
