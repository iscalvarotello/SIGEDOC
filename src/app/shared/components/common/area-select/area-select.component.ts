import { Component, OnInit, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableSelectComponent, SelectOption } from '../../filters/searchable-select.component';
import { AreaService } from '../../../../blocks/CORE_DB/organization/areas/area.service';
import { AreaDTO } from '../../../../blocks/CORE_DB/organization/areas/area.dto';
import { SVG_ICONS } from '../../../icons/svg-icons';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

@Component({
  selector: 'app-area-select',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent, SafeHtmlPipe],
  template: `
    <div class="relative w-full flex items-center gap-1.5">
      <div class="flex-1">
        <app-searchable-select
          [placeholder]="placeholder()"
          [options]="areasOptions()"
          [value]="selectedId()"
          [disabled]="disabled()"
          [isLoading]="isLoading()"
          (onSelect)="selectArea($event)">
        </app-searchable-select>
      </div>
      @if (showReload()) {
        <button 
          type="button" 
          (click)="loadAreas(true)"
          [disabled]="isLoading() || disabled()"
          class="p-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500 hover:text-[#691C32] dark:hover:text-[#BC955C] active:scale-95 flex items-center justify-center shrink-0 disabled:opacity-50"
          title="Recargar áreas">
          @if (isLoading()) {
            <span class="flex items-center justify-center" [innerHTML]="icons.animated_reload | safeHtml"></span>
          } @else {
            <span class="w-4 h-4 flex items-center justify-center" [innerHTML]="icons.Refresh | safeHtml"></span>
          }
        </button>
      }
    </div>
  `
})
export class AreaSelectComponent implements OnInit {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  placeholder = input<string>('Seleccione Área...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(true);

  onSelect = output<AreaDTO>();

  private areaService = inject(AreaService);
  rawAreas = signal<AreaDTO[]>([]);
  isLoading = signal<boolean>(false);

  areasOptions = computed<SelectOption[]>(() => {
    return this.rawAreas().map(item => {
      // acronym " - " + area_type + " " + connector + " " + name
      const typeName = item.area_type && typeof item.area_type === 'object' ? (item.area_type as any).name : item.area_type;
      const desc = [typeName, item.connector, item.name].filter(Boolean).join(' ');
      const label = item.acronym ? `${item.acronym} - ${desc}` : desc;
      return {
        id: item.id,
        label: label,
        searchTerms: `${item.acronym || ''} ${desc}`.toLowerCase()
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

  selectArea(id: string) {
    const area = this.rawAreas().find(a => a.id === id);
    if (area) {
      this.onSelect.emit(area);
    }
  }
}
