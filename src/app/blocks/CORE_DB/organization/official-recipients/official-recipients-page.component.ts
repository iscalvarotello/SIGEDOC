import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '../../../../shared/classes/base-page.controller';
import { MasterWrapperComponent } from '../../../../shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '../../../../shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '../../../../shared/components/master-detail/detail-viewer.component';
import { OfficialRecipientDTO } from './official-recipient.dto';
import { OfficialRecipientService } from './official-recipient.service';
import { OFFICIAL_RECIPIENT_PAGE_CONFIG } from './official-recipient-page.config';

@Component({
  selector: 'app-official-recipients-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  template: `
    <app-master-wrapper 
      title="Destinatarios Oficiales" 
      icon="👤" 
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar por nombre, puesto, dependencia..."
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
export class OfficialRecipientsPageComponent extends BasePageController<OfficialRecipientDTO> {
  protected apiService = inject(OfficialRecipientService);
  public pageConfig = OFFICIAL_RECIPIENT_PAGE_CONFIG;

  override filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let items = this.rawData();
    
    if (this.pageConfig.sortConfig) {
      const key = this.pageConfig.sortConfig.key as keyof OfficialRecipientDTO;
      const dir = this.pageConfig.sortConfig.direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA !== undefined && valB !== undefined) {
          if (valA > valB) return 1 * dir;
          if (valA < valB) return -1 * dir;
        }
        return 0;
      });
    }
    
    if (!term) return items;
    
    return items.filter(item => {
      return this.pageConfig.searchFields?.some(field => {
        const val = item[field as keyof OfficialRecipientDTO];
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });
}
