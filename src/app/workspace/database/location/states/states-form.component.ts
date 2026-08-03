import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormController } from '@baseclass/base-form.controller';
import { StateDTO } from './state.dto';
import { StateService } from './state.service';
import { STATE_FORM_CONFIG } from './state-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-states-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './states-form.component.html'
})
export class StatesFormComponent extends BaseFormController<StateDTO> {
  protected apiService = inject(StateService);
  protected controllerConfig = STATE_FORM_CONFIG;
}
