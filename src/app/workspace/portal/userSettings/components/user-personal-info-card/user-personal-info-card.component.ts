import { Component, inject, signal, computed } from '@angular/core';
import { SesionService } from '@services/sesion.service';
import { PersonService } from '@rh/persons/person.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '@system-shared/form/input/input-field.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { LabelComponent } from '@system-shared/form/label/label.component';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-user-personal-info-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    ActionButtonComponent,
    LabelComponent,
    ModalComponent,
    IconComponent
  ],
  templateUrl: './user-personal-info-card.component.html'
})
export class UserPersonalInfoCardComponent {
  public sesionService = inject(SesionService);
  private personService = inject(PersonService);

  isOpen = false;
  isSaving = false;

  // Reactividad para datos de sesión
  userData = computed(() => this.sesionService.currentUserData());
  personalData = computed(() => this.userData()?.datos_personales || {});

  // Campos del formulario
  formModel = {
    prefix: '',
    name: '',
    first_surname: '',
    second_surname: '',
    nickname: '',
    phone: '',
    email: '',
    curp: '',
    rfc: '',
    sex: ''
  };

  openModal() {
    const current = this.personalData();
    // Clonar los datos al modelo del formulario al abrir el modal
    this.formModel = {
      prefix: current.prefix || '',
      name: current.name || '',
      first_surname: current.first_surname || '',
      second_surname: current.second_surname || '',
      nickname: current.nickname || '',
      phone: current.phone || '',
      email: current.email || '',
      curp: current.curp || '',
      rfc: current.rfc || '',
      sex: current.sex || ''
    };
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  async handleSave() {
    const current = this.personalData();
    if (!current || !current.id) {
      console.error('No se pudo encontrar el ID de datos personales para actualizar.');
      return;
    }

    this.isSaving = true;
    try {
      // LLamamos al endpoint /rh/persons/:id para actualizar en BD
      await this.personService.update(current.id, this.formModel);
      
      // Actualizamos la sesión en memoria para refrescar instantáneamente en el header, etc.
      this.sesionService.updatePersonalData(this.formModel);
      
      this.closeModal();
    } catch (error) {
      console.error('Error al guardar datos personales:', error);
      alert('Ocurrió un error al guardar los cambios. Intente de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }
}

