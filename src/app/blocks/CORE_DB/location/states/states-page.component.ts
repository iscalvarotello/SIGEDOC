import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { StateDTO } from './state.dto';
import { StateService } from './state.service';
import { STATE_PAGE_CONFIG } from './state-page.config';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { FilterCountryComponent } from '@app/shared/components/filters/filter-country.component';

@Component({
  selector: 'app-states-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterCountryComponent],
  templateUrl: './states-page.component.html'
})
export class StatesPageComponent extends BasePageController<StateDTO> {
  protected apiService = inject(StateService);
  public pageConfig = STATE_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    // Aplicamos ordenamiento por defecto definido en config
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof StateDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        if (a[key] > b[key]) return 1 * dir;
        if (a[key] < b[key]) return -1 * dir;
        return 0;
      });
    }
    
    if (!term) return items;
    
    return items.filter(item => {
      // Usamos searchFields de la configuración
      return this.pageConfig.searchFields?.some(field => {
        const val = item[field as keyof StateDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });

  onCountryChanged(event: { countryId: string }) {
    // Cuando el filtro cambia, le decimos a BasePageController que dispare loadData
    // mandándole el countryId como un urlParam, lo que inyectará :countryId en la ruta especial
    this.loadData(false, { countryId: event.countryId });
  }
}
