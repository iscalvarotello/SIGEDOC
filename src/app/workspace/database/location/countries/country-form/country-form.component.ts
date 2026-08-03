import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../country.service';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { BaseFormController } from '@baseclass/base-form.controller';
import { CountryDTO } from '../country.dto';
import { COUNTRY_FORM_CONFIG } from './country-form.config';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './country-form.component.html'
})
export class CountryFormComponent extends BaseFormController<CountryDTO> {
  
  // 1. Inyectamos nuestro servicio específico
  protected override apiService = inject(CountryService);

  // 2. Definimos la configuración para esta clase
  protected override controllerConfig = {
    mainRoute: '/database/location/countries',
    cacheKeyToInvalidate: 'COUNTRIES',
    formConfig: COUNTRY_FORM_CONFIG
  };

}
