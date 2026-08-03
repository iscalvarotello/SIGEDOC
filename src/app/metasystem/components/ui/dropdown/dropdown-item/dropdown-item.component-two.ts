import { CommonModule } from '@angular/common';
import { Component, input, output, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-dropdown-item-two',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <li>
      <a
        [routerLink]="to()"
        [queryParams]="queryParams()"
        [class]="computedClasses()"
        (click)="handleClick($event)"
      >
        @if (icon()) {
          <icon [icon]="icon()!" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 w-5 h-5 flex items-center justify-center shrink-0"></icon>
        }
        <ng-content></ng-content>
      </a>
    </li>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class DropdownItemTwoComponent {
  to = input<string | null>(null);
  queryParams = input<any>(null);
  icon = input<string | null>(null);
  
  // Custom styles si es necesario sobrescribir
  customClasses = input<string>('');
  
  itemClick = output<void>();

  computedClasses = computed(() => {
    const base = 'flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer';
    return `${base} ${this.customClasses()}`.trim();
  });

  handleClick(event: Event) {
    if (!this.to()) {
      event.preventDefault(); // Evitar saltos de vista si no hay ruta
    }
    this.itemClick.emit();
  }
}
