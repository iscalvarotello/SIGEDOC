import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ListComponent } from '@system-shared/ui/list/list.component';

@Component({
  selector: 'force-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ActionButtonComponent, ControlComponent, TitleComponent, ListComponent],
  templateUrl: './force-password-modal.component.html'
})
export class ForcePasswordModalComponent {
  @Input() isOpen: boolean = false;
  @Input() isForcingPassword: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  listItems = [
    'Sus tokens actuales de sesión se invalidarán y serán expulsados.',
    'Su contraseña volverá a ser la <strong>Contraseña Predeterminada</strong> que definiste arriba.',
    'El sistema les obligará a establecer una nueva contraseña privada en su próximo login.'
  ];

  confirmWord = signal<string>('');

  onClose() {
    this.confirmWord.set('');
    this.close.emit();
  }

  onSubmit() {
    if (this.confirmWord().toLowerCase() !== 'forzar') {
      alert('Debe escribir la palabra "FORZAR" exactamente para continuar.');
      return;
    }
    this.submitForm.emit();
    // No reseteamos la palabra aquí, dejamos que el componente padre cierre el modal si tiene éxito, 
    // lo que dispararía (close) en el template, o lo reiniciamos si queremos:
  }
}
