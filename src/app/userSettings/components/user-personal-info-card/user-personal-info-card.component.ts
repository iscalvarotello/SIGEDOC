import { Component, inject, signal, computed } from '@angular/core';
import { SesionService } from '@shared/services/sesion.service';
import { PersonService } from '@core_db/rh/persons/person.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '@components/form/input/input-field.component';
import { ButtonComponent } from '@components/ui/button/button.component';
import { LabelComponent } from '@components/form/label/label.component';
import { ModalComponent } from '@components/ui/modal/modal.component';

@Component({
  selector: 'app-user-personal-info-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent
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
