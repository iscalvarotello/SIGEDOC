import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-pdf-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (displayMode() === 'button') {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="px-3.5 py-1.5 bg-[#BC955C] hover:bg-[#a68350] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {{ label() }}
      </button>
    } @else {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="text-xs font-bold text-[#BC955C] hover:text-[#a68350] flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {{ label() }}
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    }
  `
})
export class PreviewPdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Borrador PDF');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
