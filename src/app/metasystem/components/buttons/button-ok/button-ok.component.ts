import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'button-ok',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="success-light"
      size="xs"
      icon="CheckCircle"
      [disabled]="disabled()"
      [loading]="loading()"
      [title]="title()"
      [label]="label()"
      iconPosition="right"
      (clicked)="clicked.emit($event)">
    </action-button>
  `
})
export class ButtonOkComponent {
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  title = input<string>('Marcar observaciones como atendidas/OK');
  label = input<string>('ok');
  clicked = output<MouseEvent>();
}
