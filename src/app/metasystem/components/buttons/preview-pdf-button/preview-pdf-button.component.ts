import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'preview-pdf-button',
  standalone: true,
  imports: [ActionButtonComponent],
  template: `
    <action-button 
      variant="secondary"
      size="sm"
      icon="DocumentText"
      [displayMode]="displayMode()"
      [iconPosition]="displayMode() === 'link' ? 'right' : 'left'"
      [disabled]="disabled()"
      [label]="label()"
      (clicked)="clicked.emit($event)">
    </action-button>
  `
})
export class PreviewPdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Borrador PDF');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
