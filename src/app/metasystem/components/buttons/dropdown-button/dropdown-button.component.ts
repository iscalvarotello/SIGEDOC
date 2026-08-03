import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'dropdown-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dropdown-button.component.html'
})
export class DropdownButtonComponent {
  /** Texto principal */
  label = input<string>('Seleccionar Opciones...');
  
  /** Texto secundario pequeño (opcional) */
  sublabel = input<string>();
  
  /** 
   * Icono para mostrar a la izquierda. 
   */
  icon = input<string>();
  
  /** Determina si el string pasado a icon es un emoji */
  isEmoji = input<boolean>(false);
  
  /** Estado abierto/cerrado para rotar el chevron */
  isOpen = input<boolean>(false);

  /** Evento disparado al dar clic */
  clicked = output<void>();
}
