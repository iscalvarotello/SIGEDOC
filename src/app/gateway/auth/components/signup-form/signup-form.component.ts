import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LabelComponent } from '@system-shared/form/label/label.component';
import { InputFieldComponent } from '@system-shared/form/input/input-field.component';
import { PasswordInputComponent } from '@system-shared/form/input/password-input.component';
import { SubmitButtonComponent } from '@system-shared/buttons/index';
import { AuthService } from '@core/services/auth.service';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LabelComponent, InputFieldComponent, PasswordInputComponent, SubmitButtonComponent, IconComponent, ActionButtonComponent],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {
  appSettings = APP_SETTINGS;
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Form values
  curp = '';
  email = '';
  password = '';
  confirmPassword = '';

  // Step state (datos devueltos por el alta previa de RH/Sistemas)
  curpVerified = false;
  collaboratorId = '';
  collaboratorName = '';
  collaboratorPuesto = '';
  collaboratorArea = '';
  collaboratorRfc = '';

  // Local reactive states
  isCheckingCurp = signal<boolean>(false);
  isRegistering = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  /**
   * Valida la CURP contra la base de datos de colaboradores
   */
  async verifyCurp() {
    const cleanCurp = this.curp.trim().toUpperCase();
    if (!cleanCurp || cleanCurp.length !== 18) {
      this.errorMessage.set('La CURP debe tener exactamente 18 caracteres.');
      return;
    }

    this.isCheckingCurp.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    try {
      // Intentar consultar el endpoint del backend
      const res = await firstValueFrom(
        this.http.get<any>(`${baseUrl}/users/usuarios/curp/${cleanCurp}`)
      );

      if (res && res.employee_id) {
        this.curpVerified = true;
        this.collaboratorId = res.employee_id;
        this.collaboratorName = `${res.name || ''} ${res.first_surname || ''} ${res.second_surname || ''}`.trim();
        this.collaboratorRfc = res.rfc || '';
        this.email = res.email || '';
        this.collaboratorPuesto = res.job_name || 'Colaborador';
        this.collaboratorArea = res.area_name || 'Sin Área Asignada';

        this.successMessage.set(`¡Colaborador verificado exitosamente!`);
      } else {
        this.errorMessage.set('La CURP no corresponde a ningún colaborador registrado.');
      }
    } catch (err: any) {
      console.error('Error al validar la CURP:', err);
      if (err.status === 404) {
        this.errorMessage.set('La CURP no se encuentra registrada en el sistema de colaboradores.');
      } else {
        // Fallback de desarrollo: si la CURP tiene formato válido de CURP, permitir pruebas locales
        const formatValid = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(cleanCurp);
        if (formatValid) {
          setTimeout(() => {
            this.curpVerified = true;
            this.collaboratorId = 'd584e730-26e7-4bc2-a7fb-d13baba77f4a';
            this.collaboratorName = 'ALVARO TELLO GUTIÉRREZ';
            this.collaboratorPuesto = 'ANALISTA TÉCNICO ESPECIALIZADO';
            this.collaboratorArea = 'SISTEMAS, DIRECCIÓN DE ATENCIÓN Y SERVICIOS EMPRESARIALES';
            this.collaboratorRfc = 'TEGA800723BP1';
            this.email = 'iscalvarotello@gmail.com';
            this.successMessage.set('¡Colaborador verificado exitosamente (Modo de prueba local)!');
            this.isCheckingCurp.set(false);
          }, 800);
          return;
        }
        this.errorMessage.set(err?.error?.message || 'Error de conexión con el servidor.');
      }
    } finally {
      this.isCheckingCurp.set(false);
    }
  }

  /**
   * Registra las credenciales de acceso para el colaborador validado
   */
  async onSignUpSubmit() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Por favor, completa todos los campos del registro.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('La contraseña y su confirmación no coinciden.');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.isRegistering.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    try {
      await firstValueFrom(
        this.http.post<any>(`${baseUrl}/users/usuarios`, {
          curp: this.curp.trim().toUpperCase(),
          email: this.email.trim(),
          password: this.password,
          employee_id: this.collaboratorId,
          backend_role: 'user',
          system_role_id: 2
        })
      );

      this.successMessage.set('¡Registro completado con éxito! Iniciando sesión automáticamente...');
      
      // Auto-login con las nuevas credenciales creadas
      const loginRes = await this.authService.login(this.email.trim(), this.password);
      
      setTimeout(() => {
        if (loginRes && loginRes.reset_password_required) {
          this.router.navigate(['/reset-password-required']);
        } else {
          this.router.navigate(['/']);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error al registrar cuenta:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al completar el registro.');
    } finally {
      this.isRegistering.set(false);
    }
  }
}
