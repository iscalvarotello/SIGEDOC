import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'doc-type-selector',
  standalone: true,
  imports: [IconComponent, CommonModule, ActionButtonComponent],
  templateUrl: './doc-type-selector.component.html',
})
export class DocTypeSelectorComponent {
  @Input() selectedTipo: 'directo' | 'gestionado' = 'directo';
  @Input() countDirecto: number = 0;
  @Input() countGestionado: number = 0;
  @Input() isLoading: boolean = false;

  @Output() tipoChange = new EventEmitter<'directo' | 'gestionado'>();
  @Output() refresh = new EventEmitter<void>();
}