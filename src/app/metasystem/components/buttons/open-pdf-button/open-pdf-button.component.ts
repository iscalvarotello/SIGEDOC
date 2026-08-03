import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'open-pdf-button',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="glass"
      size="sm"
      icon="OjoAbierto"
      [displayMode]="displayMode()"
      [iconPosition]="displayMode() === 'link' ? 'right' : 'left'"
      [disabled]="disabled()"
      [label]="label()"
      (clicked)="clicked.emit($event)">
    </action-button>
  `
})
export class OpenPdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Ver PDF Oficial');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
