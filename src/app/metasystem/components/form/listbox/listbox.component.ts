import { Component, ContentChild, TemplateRef, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseListboxDirective } from './base-listbox.directive';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-listbox',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListboxComponent),
      multi: true
    }
  ],
  templateUrl: './listbox.component.html',
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ListboxComponent extends BaseListboxDirective {
  // Opcionalmente podemos usar un template personalizado para dibujar las opciones
  @ContentChild('optionTemplate') optionTemplate?: TemplateRef<any>;
  
  // Opcionalmente podemos usar un template personalizado para el botón trigger
  @ContentChild('triggerTemplate') triggerTemplate?: TemplateRef<any>;
  
  // Iconos accesibles desde el HTML
  icons: Record<string, string> = SVG_ICONS;
  
  // Opciones extra de apariencia
  searchPlaceholder = input<string>('Buscar...');
  
  constructor() {
    super();
  }
}
