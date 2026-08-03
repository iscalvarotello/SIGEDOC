import { Component, inject, OnInit } from '@angular/core';
import { BaseFormController } from '@baseclass/base-form.controller';
import { UserDTO } from '../user.dto';
import { UserService } from '../user.service';
import { USUARIO_FORM_CONFIG } from './usuario-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { FormErrorParser } from '@utils/form-error-parser.util';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent extends BaseFormController<UserDTO> implements OnInit {
  protected override apiService = inject(UserService);
  public override controllerConfig = USUARIO_FORM_CONFIG;

  override ngOnInit() {
    super.ngOnInit();

    // Si estamos en modo de edición, removemos la validación requerida de la contraseña.
    if (this.isEditMode()) {
      const passwordCtrl = this.form.get('password');
      if (passwordCtrl) {
        passwordCtrl.clearValidators();
        passwordCtrl.updateValueAndValidity();
      }
    }
  }

  /**
   * Sobreescribimos loadData para mapear la propiedad plana id_empleado al control employee_id.
   */
  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
        this.contextText.set(data.email || 'Detalles del usuario');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Sobreescribimos onSave para limpiar el payload en modo de edición (omitimos la contraseña vacía).
   */
  public override async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = { ...this.form.value };

    // Si es modo edición, removemos el campo password del JSON enviado
    if (this.isEditMode()) {
      delete formValue.password;
    }

    // Convertir a número o null según corresponda
    if (formValue.system_role_id) {
      formValue.system_role_id = Number(formValue.system_role_id);
    } else {
      formValue.system_role_id = null;
    }

    // Si employee_id está vacío, lo enviamos como null
    if (!formValue.employee_id) {
      formValue.employee_id = null;
    }

    try {
      if (this.isEditMode() && this.itemId()) {
        await this.apiService.update(this.itemId()!, formValue, this.controllerConfig.cacheKeyToInvalidate);
      } else {
        await this.apiService.create(formValue, this.controllerConfig.cacheKeyToInvalidate);
      }

      // Actualizamos caché/listado
      if (typeof this.apiService.getAll === 'function') {
        await this.apiService.getAll();
      }

      this.navigateToMain();
    } catch (error: any) {
      console.error('Error al guardar el usuario:', error);
      const unmappedErrors = FormErrorParser.parse(error, this.form);
      if (unmappedErrors.length > 0) {
        alert('Hubo un problema al guardar el usuario:\n\n- ' + unmappedErrors.join('\n- '));
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
