import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { ContactInfo } from '@workspace-shared/components/common/contact-card/contact-card.component';

export interface SupplierContactPayload {
  contact: ContactInfo;
  index: number | null; // null si es nuevo
}

@Component({
  selector: 'app-supplier-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, CancelButtonComponent, ActionButtonComponent],
  templateUrl: './supplier-contact-form.component.html'
})
export class SupplierContactFormComponent implements OnChanges {
  @Input({ required: true }) isOpen: boolean = false;
  @Input() isSaving: boolean = false;
  @Input() editContact: ContactInfo | null = null;
  @Input() editIndex: number | null = null;

  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<SupplierContactPayload>();

  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      job: [''],
      email: ['', [Validators.email]],
      phone: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
      if (this.editContact) {
        this.contactForm.patchValue({
          name: this.editContact.name || '',
          job: this.editContact.job || '',
          email: this.editContact.email || '',
          phone: this.editContact.phone || ''
        });
      }
    }
  }

  resetForm() {
    this.contactForm.reset();
  }

  onSave() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload: SupplierContactPayload = {
      contact: this.contactForm.value as ContactInfo,
      index: this.editIndex
    };

    this.saveForm.emit(payload);
  }

  onCancel() {
    this.closeForm.emit();
  }
}
