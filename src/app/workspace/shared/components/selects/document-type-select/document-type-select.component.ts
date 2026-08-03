import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENTO_MAP } from '@documentos/pipes/document-maps';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';

@Component({
  selector: 'app-document-type-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="listboxOptions()"
      [disabledInput]="disabled()"
      [searchable]="false"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="value()">
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class DocumentTypeSelectComponent {
  value = input<string>('memo');
  disabled = input<boolean>(false);
  valueChange = output<string>();

  // Mapear los tipos de documento al formato de ListboxOption
  listboxOptions = computed(() => {
    return Object.values(DOCUMENTO_MAP).map(doc => {
      // Mapear el ID del documento al nombre de icono en SVG_ICONS si es necesario,
      // pero para mantenerlo rápido, podemos usar los iconos inyectados en la configuración 
      // o poner un icono por defecto si no tenemos SVG_ICONS exactos.
      // Por ahora asignamos claves dummy o mapeamos manualmente.
      let iconKey = '';
      if (doc.id === 'memo') iconKey = 'DocMemo';
      else if (doc.id === 'oficio') iconKey = 'DocOficio';
      else if (doc.id === 'ti') iconKey = 'DocTI';
      else if (doc.id === 'circular') iconKey = 'DocCircular';
      else iconKey = 'DocDefault';

      return {
        value: doc.id,
        label: doc.label,
        iconKey: iconKey
      };
    });
  });

  handleSelectionChange(opt: any) {
    if (opt) {
      this.valueChange.emit(opt.value);
    }
  }
}
