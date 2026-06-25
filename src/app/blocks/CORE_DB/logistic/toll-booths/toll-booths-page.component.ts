import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { TollBoothDTO } from './toll-booth.dto';
import { TollBoothService } from './toll-booth.service';
import { TOLL_BOOTHS_PAGE_CONFIG } from './toll-booths-page.config';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';

@Component({
  selector: 'app-toll-booths-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './toll-booths-page.component.html'
})
export class TollBoothsPageComponent extends BasePageController<TollBoothDTO> {
  protected apiService = inject(TollBoothService);
  public pageConfig = TOLL_BOOTHS_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof TollBoothDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        if (a[key] > b[key]) return 1 * dir;
        if (a[key] < b[key]) return -1 * dir;
        return 0;
      });
    }
    
    if (!term) return items;
    
    return items.filter(item => {
      return this.pageConfig.searchFields?.some((field: string) => {
        const val = item[field as keyof TollBoothDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });
}
