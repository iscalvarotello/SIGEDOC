import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'merge-pdf-button',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="teal"
      size="sm"
      icon="DocumentAdd"
      [displayMode]="displayMode()"
      [iconPosition]="displayMode() === 'link' ? 'right' : 'left'"
      [disabled]="disabled()"
      [label]="label()"
      (clicked)="clicked.emit($event)">
    </action-button>
  `
})
export class MergePdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Fusionar Documento');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
