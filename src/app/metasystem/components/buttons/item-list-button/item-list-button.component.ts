import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'item-list-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './item-list-button.component.html'
})
export class ItemListButtonComponent {
  /** Texto principal (opcional si se usa ng-content para esto) */
  label = input<string>();
  
  /** Texto secundario pequeño (opcional) */
  sublabel = input<string>();
  
  /** 
   * Icono para mostrar a la izquierda. 
   * Puede ser el nombre de un icono (ej. 'Document') o un Emoji si isEmoji=true.
   */
  icon = input<string>();
  
  /** Determina si el string pasado a icon es un emoji (para renderizarlo directamente) */
  isEmoji = input<boolean>(false);
  
  /** Color del texto secundario, por defecto dorado de la paleta */
  sublabelColorClass = input<string>('text-theme-secondary');

  /** Evento disparado al dar clic */
  clicked = output<void>();
}
