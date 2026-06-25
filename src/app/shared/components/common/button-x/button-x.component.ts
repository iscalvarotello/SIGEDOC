import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-x',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      type="button"
      [disabled]="disabled() || loading()"
      [title]="title()"
      (click)="clicked.emit($event)"
      class="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-red-50 text-red-700 hover:bg-red-105 border border-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 cursor-pointer">
      @if (loading()) {
        <span class="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-red-750"></span>
      } @else {
        <span>{{ label() }}</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      }
    </button>
  `
})
export class ButtonXComponent {
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  title = input<string>('Eliminar observaciones');
  label = input<string>('X');
  clicked = output<MouseEvent>();
}
