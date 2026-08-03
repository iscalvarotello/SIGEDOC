import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'button-x',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="danger-light"
      size="xs"
      icon="XClose"
      [disabled]="disabled()"
      [loading]="loading()"
      [title]="title()"
      [label]="label()"
      iconPosition="right"
      (clicked)="clicked.emit($event)">
    </action-button>
  `
})
export class ButtonXComponent {
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  title = input<string>('Eliminar observaciones');
  label = input<string>('X');
  clicked = output<MouseEvent>();
}
