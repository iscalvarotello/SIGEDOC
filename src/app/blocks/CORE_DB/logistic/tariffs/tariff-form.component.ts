import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@app/shared/classes/base-form.controller';
import { TariffMatrixDTO } from './tariff.dto';
import { TariffService } from './tariff.service';
import { TARIFF_FORM_CONFIG } from './tariff-form.config';
import { DynamicFormComponent } from '@app/shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@app/shared/components/dynamic-form/form-page-wrapper.component';


@Component({
  selector: 'app-tariff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Nueva Tarifa de Viáticos"
      titleEdit="Editar Tarifa de Viáticos"
      [contextText]="contextText()"
      subtitle="Ingrese la configuración y costos."
      breadcrumbLabel="Tarifas"
      breadcrumbRoute="/database/logistic/tariffs"
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
export class TariffFormComponent extends BaseFormController<TariffMatrixDTO> {
  protected override apiService = inject(TariffService);
  
  protected override controllerConfig = TARIFF_FORM_CONFIG;

  /**
   * Sobrescribimos loadData para evitar un endpoint extra GET /id
   * Obtenemos la matriz del año respectivo y buscamos la fila en memoria.
   * El ID compuesto es CATEGORIA_ALCANCE_AÑO.
   */
  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const parts = id.split('_');
      // Esperamos que el formato del ID sea siempre de 3 partes, ej. A_ESTATAL_2026
      // Si el alcance tiene más guiones bajos, el split fallaría, 
      // pero en este caso el alcance es ESTATAL, NACIONAL o INTERNACIONAL (1 sola palabra).
      if (parts.length === 3) {
        const cat = parts[0];
        const scope = parts[1];
        const year = parseInt(parts[2], 10);

        // Fetch matrix for that year
        const response: any = await this.apiService.getMatrix(year);
        const rows = response.data || response;
        
        // Encontramos nuestra fila exacta
        const row = rows.find((r: any) => 
          r.employ_category === cat && 
          r.travel_scope === scope && 
          r.year === year
        );

        if (row) {
          this.form.patchValue(row);
        } else {
          // Fallback, quizás el backend borró esa categoría
          console.warn('No se encontró la tarifa en la matriz para:', id);
        }
      } else {
         console.warn('ID de tarifa mal formado:', id);
      }
    } catch (e) {
      console.error('Error cargando la matriz para edición', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public override async ngOnInit() {
    await super.ngOnInit();
    
    // Si estamos en modo nuevo, pre-llenar el año actual para mayor comodidad
    if (!this.isEditMode()) {
      this.form.patchValue({
        year: new Date().getFullYear(),
        currency: 'MXN'
      });
    }
  }
}
