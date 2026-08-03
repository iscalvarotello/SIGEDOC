import { ServerImageComponent } from '@system-shared/images/index';
import { Component, inject } from '@angular/core';
import { InputFieldComponent } from '@system-shared/form/input/input-field.component';
import { PasswordInputComponent } from '@system-shared/form/input/password-input.component';
import { ModalService } from '@services/modal.service';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SesionService } from '@services/sesion.service';
import { UserService } from '@security/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '@system-shared/form/label/label.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ButtonXComponent } from '@system-shared/buttons/button-x/button-x.component';

@Component({
  selector: 'app-user-meta-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, InputFieldComponent, PasswordInputComponent, ActionButtonComponent, LabelComponent, IconComponent, ButtonXComponent, ServerImageComponent],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {
  public curentUser = inject(SesionService);
  private userService = inject(UserService);

  constructor(public modal: ModalService) {}

  isOpen = false;
  isSaving = false;
  isUploadingPhoto = false;
  photoErrorMessage = '';
  photoSuccessMessage = '';
  async onFileSelected(event: Event) {
    this.photoErrorMessage = '';
    this.photoSuccessMessage = '';
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.photoErrorMessage = 'El archivo seleccionado debe ser una imagen.';
      return;
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.photoErrorMessage = 'La imagen es demasiado grande. El tamaño máximo permitido es de 5MB.';
      return;
    }

    this.isUploadingPhoto = true;
    try {
      await this.userService.uploadProfilePhoto(file);
      this.photoSuccessMessage = '¡Foto de perfil actualizada exitosamente!';
      this.curentUser.triggerPhotoReload();
      
      // Auto-ocultar mensaje de éxito
      setTimeout(() => {
        this.photoSuccessMessage = '';
      }, 5000);
    } catch (error: any) {
      console.error('Error al subir la foto de perfil:', error);
      this.photoErrorMessage = error?.error?.message || 'Ocurrió un error al subir la foto. Intente de nuevo.';
    } finally {
      this.isUploadingPhoto = false;
      input.value = '';
    }
  }
  
  public link_whatsapp: string = 'https://wa.me/';

  getWhatsAppNumber(): string {
    const data = this.curentUser.dataUser;
    if (!data.telefono) return '';
    const cleanPhone = data.telefono.replace(/\D/g, '');
    const cleanCode = (data.country_code || '').replace(/\D/g, '');
    return `${cleanCode || '52'}${cleanPhone}`;
  }

  // Modelo del formulario de cambio de contraseña
  formModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  errorMessage = '';
  successMessage = '';

  openModal() {
    this.formModel = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  async handleSave() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formModel.currentPassword) {
      this.errorMessage = 'Por favor, ingrese su contraseña actual.';
      return;
    }

    // Validar coincidencia de nueva contraseña
    if (this.formModel.newPassword !== this.formModel.confirmPassword) {
      this.errorMessage = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }

    if (this.formModel.newPassword.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    const user = this.curentUser.currentUserData();
    const userId = user?.id || user?.id_usuario;
    if (!userId) {
      this.errorMessage = 'No se encontró una sesión activa de usuario.';
      return;
    }

    this.isSaving = true;
    try {
      await this.userService.changePassword(userId, {
        currentPassword: this.formModel.currentPassword,
        newPassword: this.formModel.newPassword
      });
      
      this.successMessage = 'Contraseña cambiada con éxito.';
      this.formModel = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      // Cerrar modal automáticamente tras 1.5s
      setTimeout(() => {
        this.closeModal();
      }, 1500);

    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      this.errorMessage = error?.error?.message || 'Error al cambiar la contraseña. Verifique que su contraseña actual sea correcta.';
    } finally {
      this.isSaving = false;
    }
  }
}

