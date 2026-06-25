import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormController } from '../../../../shared/classes/base-form.controller';
import { CityDTO } from './city.dto';
import { CityService } from './city.service';
import { CITY_FORM_CONFIG } from './city-form.config';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '../../../../shared/components/dynamic-form/form-page-wrapper.component';
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
}
