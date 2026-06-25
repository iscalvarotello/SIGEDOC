import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { AreaTypeDTO } from './area-type.dto';
import { AreaTypeService } from './area-type.service';
import { AREA_TYPE_PAGE_CONFIG } from './area-type-page.config';

@Component({
  selector: 'app-area-types-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  template: `
    <app-master-wrapper 
      title="Tipos de Área" 
      icon="📑" 
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar tipo de área..."
      (onSearch)="filtrar($event)"
      (onRefresh)="refresh()"
      (onSync)="sync()"
      (onNew)="nuevo()">
      
      <div master class="h-full">
        <app-data-table 
          [data]="filteredItems()" 
          [columns]="pageConfig.tableColumns"
          [selectedItem]="selectedItem()"
          [isLoading]="isLoading()"
          (onRowSelect)="select($event)"
          (onEdit)="edit($event)"
          (onDelete)="delete($event)">
        </app-data-table>
      </div>

      <div detail class="h-full flex flex-col">
        <app-detail-viewer 
          [data]="selectedItem()"
          [headerConfig]="pageConfig.detailHeader"
          [fields]="pageConfig.detailFields">
        </app-detail-viewer>
      </div>

    </app-master-wrapper>
  `
})
export class AreaTypesPageComponent extends BasePageController<AreaTypeDTO> {
  protected apiService = inject(AreaTypeService);
  public pageConfig = AREA_TYPE_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof AreaTypeDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        if (a[key] > b[key]) return 1 * dir;
        if (a[key] < b[key]) return -1 * dir;
        // Si el index_sort es igual, ordenamos por hierarchy_order
        if (a.hierarchy_order > b.hierarchy_order) return 1 * dir;
        if (a.hierarchy_order < b.hierarchy_order) return -1 * dir;
        return 0;
      });
    }
    
    if (!term) return items;
    
    return items.filter(item => {
      return this.pageConfig.searchFields?.some(field => {
        const val = item[field as keyof AreaTypeDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });
}
