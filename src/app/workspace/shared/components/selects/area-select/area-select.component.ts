import { Component, OnInit, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AreaService } from '@organization/areas/area.service';
import { AreaDTO } from '@organization/areas/area.dto';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';

@Component({
  selector: 'app-area-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="areasOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="loadAreas(true)"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
      
      <!-- Plantilla predeterminada (texto plano) -->
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class AreaSelectComponent implements OnInit {
  selectedId = input<string>('');
  placeholder = input<string>('Seleccione Área...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(true);

  onSelect = output<AreaDTO>();

  private areaService = inject(AreaService);
  rawAreas = signal<AreaDTO[]>([]);
  isLoading = signal<boolean>(false);

  areasOptions = computed(() => {
    return this.rawAreas().map(item => {
      const typeName = item.area_type && typeof item.area_type === 'object' ? (item.area_type as any).name : item.area_type;
      const desc = [typeName, item.connector, item.name].filter(Boolean).join(' ');
      const label = item.acronym ? `${item.acronym} - ${desc}` : desc;
      return {
        value: item.id,
        label: label,
        raw: item,
        iconKey: 'Organizacion'
      };
    });
  });

  ngOnInit() {
    this.loadAreas();
  }

  async loadAreas(forceRefresh = false) {
    this.isLoading.set(true);
    try {
      const response = await this.areaService.getAll(
        undefined, 
        { enabled: true, key: 'AREAS_COMBO', ttlMinutes: 10 }, 
        forceRefresh
      );
      this.rawAreas.set(response.data || []);
    } catch (error) {
      console.error('Error al cargar catálogo de áreas en AreaSelect:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleSelectionChange(opt: any) {
    if (opt) {
      this.onSelect.emit(opt.raw);
    } else {
      // Para limpiar, emitimos null o dejamos de emitir
    }
  }
}
