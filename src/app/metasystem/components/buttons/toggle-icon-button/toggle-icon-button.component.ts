import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export type ToggleButtonVariant = 'default' | 'ghost';

@Component({
  selector: 'toggle-icon-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [title]="title()"
      (click)="toggle()"
      [ngClass]="computedClasses()"
      [attr.aria-label]="title()">
      <icon [icon]="currentIcon()" class="w-5 h-5 flex items-center justify-center"></icon>
    </button>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class ToggleIconButtonComponent {
  active = input<boolean>(false);
  iconOn = input.required<string>();
  iconOff = input.required<string>();
  
  variant = input<ToggleButtonVariant>('default');
  title = input<string>('');

  toggled = output<boolean>();

  currentIcon = computed(() => {
    return this.active() ? this.iconOn() : this.iconOff();
  });

  computedClasses = computed(() => {
    let base = 'items-center justify-center w-10 h-10 rounded-lg flex transition-colors active:scale-95 ';
    
    // Size and layout adaptions could be added here if needed, currently mimicking original lg:h-11 lg:w-11 xl:border
    base += 'lg:h-11 lg:w-11 xl:border ';

    if (this.variant() === 'default') {
      base += 'text-gray-500 border-gray-200 dark:border-gray-800 dark:text-gray-400 ';
      if (this.active()) {
        base += 'bg-gray-100 dark:bg-white/[0.03] ';
      } else {
        base += 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 ';
      }
    } else if (this.variant() === 'ghost') {
      base += 'text-gray-500 dark:text-gray-400 border-transparent ';
      if (this.active()) {
        base += 'bg-gray-100 dark:bg-white/[0.03] text-gray-900 dark:text-white ';
      } else {
        base += 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 ';
      }
    }

    return base.trim();
  });

  toggle() {
    this.toggled.emit(!this.active());
  }
}
