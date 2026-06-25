import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { CityDTO } from './city.dto';
import { CityService } from './city.service';
import { CITY_PAGE_CONFIG } from './city-page.config';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { FilterStateComponent } from '../../../../shared/components/filters/filter-state.component';

@Component({
  selector: 'app-cities-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterStateComponent],
  templateUrl: './cities-page.component.html'
})
export class CitiesPageComponent extends BasePageController<CityDTO> {
  protected apiService = inject(CityService);
  public pageConfig = CITY_PAGE_CONFIG;
  selectedStateContext: string = '';

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    // Aplicamos ordenamiento por defecto definido en config
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof CityDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        if (a[key] > b[key]) return 1 * dir;
        if (a[key] < b[key]) return -1 * dir;
        return 0;
      });
    }
    
    if (!term) return items;
    
    return items.filter(item => {
      return this.pageConfig.searchFields?.some(field => {
        const val = item[field as keyof CityDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });

  onStateChanged(event: { stateId: string, contextText?: string }) {
    if (event.stateId) {
      this.selectedStateContext = event.contextText || '';
      this.loadData(false, { stateId: event.stateId });
    } else {
      // Si el estado viene vacío (ej. el país seleccionado no tiene estados), vaciamos la lista
      this.selectedStateContext = '';
      this.rawData.set([]);
    }
  }

  override nuevo() {
    this.router.navigate([this.pageConfig.mainRoute, 'new'], { 
      queryParams: { 
        ...this.activeUrlParams,
        context_text: this.selectedStateContext
      } 
    });
  }
}
