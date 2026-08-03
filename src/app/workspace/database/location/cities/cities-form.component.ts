import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormController } from '@baseclass/base-form.controller';
import { CityDTO } from './city.dto';
import { CityService } from './city.service';
import { CITY_FORM_CONFIG } from './city-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './cities-form.component.html'
})
export class CitiesFormComponent extends BaseFormController<CityDTO> {
  protected apiService = inject(CityService);
  protected controllerConfig = CITY_FORM_CONFIG;

  override ngOnInit() {
    super.ngOnInit();
    
    // Al cambiar de país, limpiar el estado seleccionado.
    this.form.get('country_id')?.valueChanges.subscribe(() => {
      this.form.get('state_id')?.setValue(null);
    });
  }
}
