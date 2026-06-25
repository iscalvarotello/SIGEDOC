import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merge-pdf-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (displayMode() === 'button') {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-transparent shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
        {{ label() }}
      </button>
    } @else {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {{ label() }}
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      </button>
    }
  `
})
export class MergePdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Fusionar Documento');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
