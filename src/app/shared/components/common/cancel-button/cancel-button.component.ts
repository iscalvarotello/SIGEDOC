import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cancel-button',
  standalone: true,
  template: `
    <button 
      type="button" 
      [disabled]="disabled()"
      (click)="clicked.emit($event)"
      class="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed">
      {{ label() }}
    </button>
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
