import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'submit-button',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  template: `
    <action-button 
      type="submit"
      variant="primary"
      size="lg"
      [disabled]="disabled()"
      [loading]="submitting()"
      [fullWidth]="true"
      [label]="label()"
      (clicked)="clicked.emit()">
    </action-button>
  `,
  host: {
    'class': 'flex-1 block w-full min-w-0'
  }
})
export class SubmitButtonComponent {
  label = input<string>('Confirmar');
  disabled = input<boolean>(false);
  submitting = input<boolean>(false);
  clicked = output<void>();
}
