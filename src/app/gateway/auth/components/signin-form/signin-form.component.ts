import { TitleSystemComponent } from '@metasystem/components/title-system/title-system.component';
import { InstitutionImageComponent } from '../institution-image/institution-image.component';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, inject, signal, OnInit } from '@angular/core';
import { LabelComponent } from '@system-shared/form/label/label.component';
import { SubmitButtonComponent } from '@system-shared/buttons/index';
import { InputFieldComponent } from '@system-shared/form/input/input-field.component';
import { PasswordInputComponent } from '@system-shared/form/input/password-input.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { TenantService } from '@core/services/tenant.service';
import { CommonModule } from '@angular/common';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { ListboxOption } from '@system-shared/form/listbox/base-listbox.directive';
import { computed } from '@angular/core';

@Component({
  selector: 'app-signin-form',
  imports: [LabelComponent, SubmitButtonComponent, InputFieldComponent, PasswordInputComponent, RouterModule, FormsModule, CommonModule, ListboxComponent, TitleSystemComponent, InstitutionImageComponent],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent implements OnInit {
  appSettings = APP_SETTINGS;
  
  private router = inject(Router);
  private authService = inject(AuthService);
  public tenantService = inject(TenantService);

  email = '';
  password = '';

  // Estados reactivos locales para la carga y errores
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Computed para las opciones del Listbox
  institutionOptions = computed<ListboxOption[]>(() => {
    return this.tenantService.institutions().map(inst => ({
      value: inst.id,
      label: inst.name,
      iconKey: 'Bank'
    }));
  });

  ngOnInit() {
    this.tenantService.loadInstitutionsForLogin();
  }

  onInstitutionChange(selectedOption: any | null) {
    const selectedId = selectedOption ? selectedOption.value : null;
    if (!selectedId) return;
    const list = this.tenantService.institutions();
    const found = list.find(i => i.id === selectedId);
    if (found) {
      this.tenantService.setTenant(found);
    }
  }

  async onSignIn() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const currentTenantId = this.tenantService.currentTenant()?.id;
      const res = await this.authService.login(this.email, this.password, currentTenantId);
      if (res && res.reset_password_required) {
        this.router.navigate(['/reset-password-required']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      
      // Control de Modo Mantenimiento (403 Forbidden)
      if (error?.status === 403) {
        const errorMsg = error?.error?.message || error?.message || '';
        if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('mantenimiento')) {
          this.router.navigate(['/maintenance']);
          return;
        }
      }

      // Control de Sistema sin inicializar (404)
      if (error?.status === 404 && (error?.error?.message === 'Sistema sin inicializar' || error?.message === 'Sistema sin inicializar')) {
        try {
          await this.authService.setupFirstAdmin(this.email, this.password);
          // Si tuvo éxito, iniciar sesión de forma normal
          const currentTenantId = this.tenantService.currentTenant()?.id;
          const res = await this.authService.login(this.email, this.password, currentTenantId);
          if (res && res.reset_password_required) {
            this.router.navigate(['/reset-password-required']);
          } else {
            this.router.navigate(['/']);
          }
          return; // Salir aquí para que no quite el isLoading hasta que redirija
        } catch (setupError: any) {
          const setupMsg = setupError?.error?.message || setupError?.message || 'Error al inicializar el sistema.';
          this.errorMessage.set(setupMsg);
          this.isLoading.set(false);
          return;
        }
      }

      const msg = error?.error?.message || error?.message || 'Error de conexión con el servidor.';
      this.errorMessage.set(msg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
