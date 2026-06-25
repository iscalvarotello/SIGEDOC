import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@shared/icons/svg-icons';
import { SafeHtmlPipe } from '@shared/pipe/safe-html.pipe';

@Component({
  selector: 'doc-type-selector',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './doc-type-selector.component.html',
})
export class DocTypeSelectorComponent {
  icons = SVG_ICONS;

  @Input() selectedTipo: 'directo' | 'gestionado' = 'directo';
  @Input() countDirecto: number = 0;
  @Input() countGestionado: number = 0;
  @Input() isLoading: boolean = false;

  @Output() tipoChange = new EventEmitter<'directo' | 'gestionado'>();
  @Output() refresh = new EventEmitter<void>();
}