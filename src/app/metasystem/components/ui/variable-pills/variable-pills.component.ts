import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VariablePill {
  key: string;
  label: string;
}

@Component({
  selector: 'app-variable-pills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variable-pills.component.html',
  host: {
    'class': 'flex flex-col h-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700 p-3 overflow-hidden min-w-0'
  }
})
export class VariablePillsComponent {
  variables = input<VariablePill[]>([]);
  title = input<string>('Variables Disponibles');
  subtitle = input<string>('Haz clic para insertar en el texto');
  
  onPillClick = output<string>();

  handleClick(key: string) {
    this.onPillClick.emit(key);
  }
}
