import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableSelectComponent, SelectOption } from './searchable-select.component';
import { AreaService } from '../../../blocks/CORE_DB/organization/areas/area.service';
import { AreaDTO } from '../../../blocks/CORE_DB/organization/areas/area.dto';

@Component({
  selector: 'app-filter-area',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  template: `
    <div class="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
      <div class="flex-shrink-0 text-gray-400 pl-2">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </div>
      <div class="flex-1">
        <app-searchable-select
          placeholder="Filtrar por Área Padre..."
          [options]="areasList"
          [value]="selectedAreaId"
          (onSelect)="selectArea($event)">
        </app-searchable-select>
      </div>
    </div>
  `
})
export class FilterAreaComponent {
  @Output() onAreaSelect = new EventEmitter<{ parentId: string }>();
  
  private areaService = inject(AreaService);
  areasList: SelectOption[] = [];
  selectedAreaId: string = '';

  constructor() {
    this.loadAreas();
  }

  async loadAreas() {
    try {
      const response = await this.areaService.getAll(undefined, { enabled: true, key: 'AREAS_COMBO' });
      const areas: AreaDTO[] = response.data || [];
      
      const mapped = areas.map(item => {
        const typeName = item.area_type && typeof item.area_type === 'object' ? (item.area_type as any).name : item.area_type;
        const full = [typeName, item.connector, item.name].filter(Boolean).join(' ');
        return {
          id: item.id,
          label: item.acronym ? `${full} (${item.acronym})` : full,
          searchTerms: item.acronym ? `${full} ${item.acronym}`.toLowerCase() : full.toLowerCase()
        };
      });
      
      this.areasList = [{ id: '', label: '-- Mostrar Todas las Áreas --' }, ...mapped];
    } catch (error) {
      console.error('Error loading areas combo', error);
    }
  }

  selectArea(item: string) {
    this.selectedAreaId = item;
    this.onAreaSelect.emit({ parentId: item });
  }
}
