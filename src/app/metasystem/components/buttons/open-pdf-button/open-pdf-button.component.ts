import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent, ActionButtonSize } from '../action-button/action-button.component';

@Component({
  selector: 'open-pdf-button',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="glass"
      [size]="size()"
      [icon]="icon()"
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
  size = input<ActionButtonSize>('sm');
  icon = input<string>('OjoAbierto');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
