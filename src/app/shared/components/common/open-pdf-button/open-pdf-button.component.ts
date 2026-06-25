import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-pdf-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (displayMode() === 'button') {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {{ label() }}
      </button>
    } @else {
      <button 
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit($event)"
        class="text-xs font-bold text-[#691C32] hover:text-[#4d1425] flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {{ label() }}
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    }
  `
})
export class OpenPdfButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('Ver PDF Oficial');
  displayMode = input<'button' | 'link'>('button');
  clicked = output<MouseEvent>();
}
