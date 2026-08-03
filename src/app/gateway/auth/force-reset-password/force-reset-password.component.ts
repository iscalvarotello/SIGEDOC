import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SesionService } from '@services/sesion.service';
import { UserService } from '@security/users/user.service';
import { AuthService } from '@app/core/services/auth.service';
import { AuthPageLayoutComponent } from '@metasystem/shell/auth-page-layout/auth-page-layout.component';
import { LabelComponent } from '@system-shared/form/label/label.component';
import { PasswordInputComponent } from '@system-shared/form/input/password-input.component';
import { SubmitButtonComponent } from '@system-shared/buttons/index';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-force-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthPageLayoutComponent, LabelComponent, PasswordInputComponent, SubmitButtonComponent, IconComponent],
  templateUrl: './force-reset-password.component.html',
  styles: []
})
export class ForceResetPasswordComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sesionService = inject(SesionService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  securityAlert = signal<boolean>(true);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const isSecurityAlert = params['security_alert'] !== 'false';
      this.securityAlert.set(isSecurityAlert);
    });
  }

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Estados reactivos
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Obtener el email del usuario en sesión temporal
  userEmail = this.sesionService.currentUserData()?.email || '';

  async onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Por favor, completa todos los campos.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage.set('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const userData = this.sesionService.currentUserData();
    const userId = userData?.id_usuario;

    if (!userId) {
      this.errorMessage.set('No se encontró una sesión de usuario válida. Por favor, inicia sesión de nuevo.');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.userService.changePassword(userId, {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      });

      this.successMessage.set('¡Contraseña actualizada con éxito! Redirigiendo al inicio de sesión...');
      
      // Limpiar sesión temporal
      this.authService.logout();

      // Redirigir a login después de 2.5 segundos
      setTimeout(() => {
        this.router.navigate(['/signin']);
      }, 2500);

    } catch (error: any) {
      console.error('Error al cambiar contraseña obligatoria:', error);
      const msg = error?.error?.message || error?.message || 'Error al intentar actualizar la contraseña. Revisa tus credenciales actuales.';
      this.errorMessage.set(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
