import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';

@Component({
  selector: 'maintenance-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ActionButtonComponent, ControlComponent, TitleComponent],
  templateUrl: './maintenance-modal.component.html'
})
export class MaintenanceModalComponent {
  @Input() isOpen: boolean = false;
  @Input() maintenanceModeActive: boolean = false;
  @Input() requiredMaintenanceWord: string = '';
  @Input() isSavingMaintenance: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  confirmWord = signal<string>('');

  onClose() {
    this.confirmWord.set('');
    this.close.emit();
  }

  onSubmit() {
    if (this.confirmWord() !== this.requiredMaintenanceWord) {
      alert(`Debe escribir la palabra "${this.requiredMaintenanceWord}" exactamente para continuar.`);
      return;
    }
    this.submitForm.emit();
  }
}
