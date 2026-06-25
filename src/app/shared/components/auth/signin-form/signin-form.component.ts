import { Component, inject, signal } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { PasswordInputComponent } from '../../form/input/password-input.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    PasswordInputComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';

  // Estados reactivos locales para la carga y errores
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  async onSignIn() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const res = await this.authService.login(this.email, this.password);
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

      const msg = error?.error?.message || error?.message || 'Error de conexión con el servidor.';
      this.errorMessage.set(msg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
