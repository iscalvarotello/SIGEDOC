import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

export interface SupplierAttachmentPayload {
  file: File;
  title: string;
  name: string;
  year?: number;
  versionable: boolean;
}

@Component({
  selector: 'app-supplier-attachment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, CancelButtonComponent, ActionButtonComponent],
  templateUrl: './supplier-attachment-form.component.html'
})
export class SupplierAttachmentFormComponent {
  @Input({ required: true }) isOpen: boolean = false;
  @Input() isUploading: boolean = false;
  @Input() isSaving: boolean = false;

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<SupplierAttachmentPayload>();

  newAttTitle = signal('');
  newAttName = signal('');
  newAttYear = signal<number | undefined>(undefined);
  newAttVersionable = signal(false);
  selectedFile = signal<File | null>(null);

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo supera el límite de 10MB');
      event.target.value = '';
      return;
    }

    this.selectedFile.set(file);
    if (!this.newAttName()) {
      this.newAttName.set(file.name);
    }

    // Clear the input value so selecting the same file again triggers change event
    event.target.value = '';
  }

  handleClose() {
    this.resetForm();
    this.closeForm.emit();
  }

  handleSave() {
    const file = this.selectedFile();
    if (!file) return;

    this.saveForm.emit({
      file,
      title: this.newAttTitle(),
      name: this.newAttName(),
      year: this.newAttYear(),
      versionable: this.newAttVersionable()
    });
  }

  resetForm() {
    this.newAttTitle.set('');
    this.newAttName.set('');
    this.newAttYear.set(undefined);
    this.newAttVersionable.set(false);
    this.selectedFile.set(null);
  }
}
