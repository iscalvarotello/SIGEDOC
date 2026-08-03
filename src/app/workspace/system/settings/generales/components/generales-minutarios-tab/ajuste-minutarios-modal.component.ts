import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { ListboxOption } from '@system-shared/form/listbox/base-listbox.directive';

@Component({
  selector: 'ajuste-minutarios-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ActionButtonComponent, TitleComponent, ControlComponent, ListboxComponent],
  templateUrl: './ajuste-minutarios-modal.component.html'
})
export class AjusteMinutariosModalComponent {
  @Input() isOpen: boolean = false;
  @Input() formGroup!: FormGroup;
  @Input() availableYears: number[] = [];
  @Input() showGestDocs: boolean = false;
  @Input() areasMinutarios: any[] = [];
  @Input() isAdjusting: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  get yearOptions(): ListboxOption[] {
    return this.availableYears.map(yr => ({ value: yr, label: yr.toString() }));
  }

  get tipoOptions(): ListboxOption[] {
    if (!this.showGestDocs) {
      return [
        { value: 'oficio', label: 'Oficios' },
        { value: 'memo', label: 'Memorándums' },
        { value: 'circular', label: 'Circulares' },
        { value: 'ti', label: 'Tarjetas Informativas' }
      ];
    } else {
      return [
        { value: 'oficio_gest', label: 'Oficios (En Gestión)' },
        { value: 'memo_gest', label: 'Memorándums (En Gestión)' },
        { value: 'circular_gest', label: 'Circulares (En Gestión)' },
        { value: 'ti_gest', label: 'Tarjetas Informativas (En Gestión)' }
      ];
    }
  }

  get scopeOptions(): ListboxOption[] {
    return [
      { value: 'specific', label: 'Área Seleccionada' },
      { value: 'all', label: 'Todas las Áreas' }
    ];
  }

  get areaOptions(): ListboxOption[] {
    return this.areasMinutarios
      .filter(m => m.area)
      .map(m => ({
        value: m.area.id,
        label: `${m.area.name} ${m.area.acronym ? '(' + m.area.acronym + ')' : ''}`
      }));
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
