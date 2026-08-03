import { Component, inject, signal } from '@angular/core';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DistanceDTO } from './distance.dto';
import { DistanceService } from './distance.service';
import { DISTANCE_FORM_CONFIG } from './distance-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-distance-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Registrar Distancia"
      titleEdit="Editar Distancia"
      [contextText]="contextText()"
      subtitle="Complete los campos requeridos para el trayecto."
      breadcrumbLabel="Distancias y Casetas"
      [breadcrumbRoute]="controllerConfig.mainRoute"
      [breadcrumbQueryParams]="breadcrumbParams()"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty"
      [isFormInvalid]="form.invalid" [globalErrors]="globalErrors()" 
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
export class DistanceFormComponent extends BaseFormController<DistanceDTO> {
  protected override apiService = inject(DistanceService);
  public override controllerConfig = DISTANCE_FORM_CONFIG;

  public breadcrumbParams = signal<any>({});

  private updateBreadcrumbParams() {
    const queryParams: any = {};
    
    // Obtener los parámetros de ruta iniciales como fallback
    const routeParams = this.route.snapshot.queryParams;
    
    const cityId = this.form?.get('origin_city_id')?.value || routeParams['origin_city_id'];
    const countryId = this.form?.get('origin_country_id')?.value || routeParams['origin_country_id'];
    const stateId = this.form?.get('origin_state_id')?.value || routeParams['origin_state_id'] || routeParams['origin_State_id'];

    if (cityId) {
      queryParams['origin_city_id'] = cityId;
    }
    if (countryId) {
      queryParams['origin_country_id'] = countryId;
    }
    if (stateId) {
      queryParams['origin_state_id'] = stateId;
    }
    this.breadcrumbParams.set(queryParams);
  }

  override ngOnInit() {
    super.ngOnInit();

    // Sincronizar el signal con los cambios del formulario
    this.form.valueChanges.subscribe(() => {
      this.updateBreadcrumbParams();
    });

    // Si viene un origin_city_id preseleccionado de la tabla maestra, lo seteamos
    this.route.queryParams.subscribe(params => {
      if (params['origin_city_id']) {
        const countryId = params['origin_country_id'];
        const stateId = params['origin_state_id'] || params['origin_State_id'];
        const cityId = params['origin_city_id'];

        if (countryId) {
          this.form.get('origin_country_id')?.setValue(countryId);
        }
        if (stateId) {
          this.form.get('origin_state_id')?.setValue(stateId);
        }
        this.form.get('origin_city_id')?.setValue(cityId);
        this.updateBreadcrumbParams();
      }
    });

    // Inicializar los parámetros de breadcrumb al inicio
    this.updateBreadcrumbParams();
  }

  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
        
        // HACK: Forzar el seteo en orden para que el LOCATION_FILTER de destino cargue correctamente
        // Ahora el LOCATION_FILTER (FilterCityComponent) resuelve la cascada internamente,
        // por lo que podemos inyectar todo de manera limpia.
        if (data.destination_country_id) {
          this.form.get('destination_country_id')?.setValue(data.destination_country_id);
        }
        if (data.destination_state_id) {
          this.form.get('destination_state_id')?.setValue(data.destination_state_id);
        }
        if (data.destination_city_id) {
          this.form.get('destination_city_id')?.setValue(data.destination_city_id);
        }

        this.updateBreadcrumbParams();
        if (data.destination_city) {
          this.contextText.set(`A ${data.destination_city} (Vía: ${data.via || 'N/A'})`);
        } else if (data.via) {
          this.contextText.set(data.via);
        } else {
          this.contextText.set('Distancia a destino');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected override navigateToMain() {
    const queryParams: any = {};
    
    // Obtener los parámetros de ruta iniciales como fallback
    const routeParams = this.route.snapshot.queryParams;
    
    const cityId = this.form.get('origin_city_id')?.value || routeParams['origin_city_id'];
    const countryId = this.form.get('origin_country_id')?.value || routeParams['origin_country_id'];
    const stateId = this.form.get('origin_state_id')?.value || routeParams['origin_state_id'] || routeParams['origin_State_id'];

    if (cityId) {
      queryParams['origin_city_id'] = cityId;
    }
    if (countryId) {
      queryParams['origin_country_id'] = countryId;
    }
    if (stateId) {
      queryParams['origin_state_id'] = stateId;
    }

    this.router.navigate([this.controllerConfig.mainRoute], { queryParams });
  }
}
