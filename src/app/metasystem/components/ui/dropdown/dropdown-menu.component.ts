import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul [class]="menuClasses()">
      <ng-content></ng-content>
    </ul>
  `
})
export class DropdownMenuComponent {
  /**
   * Determina si el menú debe tener un padding/borde superior
   */
  hasTopPadding = input<boolean>(true);
  
  /**
   * Determina si el menú debe tener un padding/borde inferior
   */
  hasBottomPadding = input<boolean>(true);

  /**
   * Si es true, agrega un borde inferior para separarlo de acciones posteriores (ej: logout)
   */
  hasBottomBorder = input<boolean>(false);
  
  /**
   * Si es true, agrega un borde superior
   */
  hasTopBorder = input<boolean>(false);

  menuClasses() {
    let classes = 'flex flex-col gap-1';
    
    if (this.hasTopPadding()) classes += ' pt-4';
    if (this.hasBottomPadding()) classes += ' pb-3';
    
    if (this.hasBottomBorder()) classes += ' border-b border-gray-200 dark:border-gray-800';
    if (this.hasTopBorder()) classes += ' border-t border-gray-200 dark:border-gray-800';
    
    return classes;
  }
}
