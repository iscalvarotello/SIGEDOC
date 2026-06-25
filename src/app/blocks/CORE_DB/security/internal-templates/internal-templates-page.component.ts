import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { InternalTemplateDTO } from './internal-template.dto';
import { InternalTemplateService } from './internal-template.service';
import { INTERNAL_TEMPLATE_PAGE_CONFIG } from './internal-template-page.config';

@Component({
  selector: 'app-internal-templates-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  template: `
    <app-master-wrapper 
      title="Catálogo de Plantillas Internas" 
      icon="📝" 
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar plantillas..."
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
export class InternalTemplatesPageComponent extends BasePageController<InternalTemplateDTO> {
  protected apiService = inject(InternalTemplateService);
  public pageConfig = INTERNAL_TEMPLATE_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof InternalTemplateDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        const valA = a[key] ? String(a[key]).toLowerCase() : '';
        const valB = b[key] ? String(b[key]).toLowerCase() : '';
        if (valA > valB) return 1 * dir;
        if (valA < valB) return -1 * dir;
        return 0;
      });
    }
    
    // Normalizar area_name a string legible para mostrar o filtrar
    items = items.map(item => {
      return {
        ...item,
        area_name: item.area_name || 'Global'
      };
    });
    
    if (!term) return items;
    
    return items.filter(item => {
      return this.pageConfig.searchFields?.some(field => {
        const val = item[field as keyof InternalTemplateDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });
}
