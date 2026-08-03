import { Component, inject } from '@angular/core';
import { BaseFormController } from '@baseclass/base-form.controller';
import { RoleDTO } from '../role.dto';
import { RoleService } from '../role.service';
import { ROLE_FORM_CONFIG } from './role-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent extends BaseFormController<RoleDTO> {
  protected override apiService = inject(RoleService);
  public override controllerConfig = ROLE_FORM_CONFIG;
}
