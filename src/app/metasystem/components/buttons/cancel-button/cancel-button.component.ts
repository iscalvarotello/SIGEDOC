import { Component, input, output } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'cancel-button',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="light"
      size="lg"
      [disabled]="disabled()"
      [fullWidth]="true"
      [label]="label()"
      (clicked)="clicked.emit($event)">
    </action-button>
  `,
  host: {
    'class': 'flex-1'
  }
})
export class CancelButtonComponent {
  label = input<string>('Cancelar');
  disabled = input<boolean>(false);
  clicked = output<MouseEvent>();
}
