import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { PartidaDTO } from './partida.dto';
import { PartidaService } from './partida.service';
import { PARTIDA_PAGE_CONFIG } from './partida-page.config';

@Component({
  selector: 'app-partidas-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  template: `
    <app-master-wrapper 
      title="Partidas Presupuestales" 
      icon="💵" 
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar partidas..."
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
export class PartidasPageComponent extends BasePageController<PartidaDTO> {
  protected apiService = inject(PartidaService);
  public pageConfig = PARTIDA_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof PartidaDTO;
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
        const val = item[field as keyof PartidaDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });
}
