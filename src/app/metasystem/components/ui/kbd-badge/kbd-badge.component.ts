import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kbd-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <kbd
      [title]="title()"
      (click)="clicked ? clicked($event) : null"
      class="inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
      [ngClass]="customClasses()">
      @for (cmd of parsedCommands(); track $index) {
        <span>{{ cmd }}</span>
      }
      <ng-content></ng-content>
    </kbd>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class KbdBadgeComponent {
  title = input<string>('');
  customClasses = input<string>('');
  commands = input<string>(''); // Ejemplo: "⌘|K"
  
  parsedCommands = computed(() => {
    const cmds = this.commands();
    if (!cmds) return [];
    return cmds.split('|').map(c => c.trim());
  });

  // Optional click handler if we want to bind an action directly
  clicked?: (event: MouseEvent) => void;
}
