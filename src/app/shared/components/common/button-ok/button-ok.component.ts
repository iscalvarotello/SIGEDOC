import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-ok',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      type="button"
      [disabled]="disabled() || loading()"
      [title]="title()"
      (click)="clicked.emit($event)"
      class="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-green-50 text-green-700 hover:bg-green-105 border border-green-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 cursor-pointer">
      @if (loading()) {
        <span class="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-green-750"></span>
      } @else {
        <span>{{ label() }}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      }
    </button>
  `
})
export class ButtonOkComponent {
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  title = input<string>('Marcar observaciones como atendidas/OK');
  label = input<string>('ok');
  clicked = output<MouseEvent>();
}
