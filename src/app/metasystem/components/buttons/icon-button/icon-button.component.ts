import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export type IconButtonVariant = 'default' | 'ghost' | 'light';

@Component({
  selector: 'icon-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [title]="title()"
      (click)="clicked.emit($event)"
      [ngClass]="computedClasses()"
      [attr.aria-label]="title()">
      <icon [icon]="icon()" class="w-5 h-5 flex items-center justify-center"></icon>
    </button>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class IconButtonComponent {
  icon = input.required<string>();
  variant = input<IconButtonVariant>('ghost');
  title = input<string>('');
  
  // Clases custom para inyectar si se necesita (como breakpoints escondidos, z-index, etc)
  customClasses = input<string>('');

  clicked = output<MouseEvent>();

  computedClasses = computed(() => {
    let base = 'items-center justify-center w-10 h-10 rounded-lg flex transition-colors active:scale-95 ';
    
    if (this.customClasses()) {
      base += this.customClasses() + ' ';
    }

    if (this.variant() === 'default') {
      base += 'text-gray-500 border border-gray-200 dark:border-gray-800 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 ';
    } else if (this.variant() === 'ghost') {
      base += 'text-gray-700 dark:text-gray-400 border border-transparent bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 ';
    } else if (this.variant() === 'light') {
      base += 'text-gray-500 bg-gray-100 dark:bg-white/[0.03] hover:bg-gray-200 dark:hover:bg-white/[0.05] ';
    }

    return base.trim();
  });
}
