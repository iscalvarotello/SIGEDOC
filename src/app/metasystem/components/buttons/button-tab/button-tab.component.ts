import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'button-tab',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      type="button"
      (click)="clicked.emit()"
      [ngClass]="[
        'w-full flex items-center justify-start gap-3 px-4 py-3 text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer',
        active() 
          ? 'bg-theme-primary/10 dark:bg-theme-primary/25 text-theme-primary dark:text-theme-primary/80 font-bold' 
          : 'bg-transparent text-gray-600 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-gray-850 font-medium'
      ]"
    >
      <span class="flex items-center justify-center text-lg w-6 h-6">
        @if (icon()) {
          <icon [icon]="icon()!" class="w-5 h-5 text-current"></icon>
        } @else {
          <ng-content select="[icon]"></ng-content>
        }
      </span>
      <span class="text-left flex-1">
        <ng-content></ng-content>
        @if (label()) {
          {{ label() }}
        }
      </span>
    </button>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class ButtonTabComponent {
  label = input<string>();
  icon = input<string>();
  active = input<boolean>(false);
  clicked = output<void>();
}
