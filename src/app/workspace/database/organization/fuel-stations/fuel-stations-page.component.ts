import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasePageController } from '@baseclass/base-page.controller';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { FilterSupplierComponent } from '@system-shared/filters/filter-supplier.component';
import { FuelStationDTO } from './fuel-station.dto';
import { FuelStationService } from './fuel-station.service';
import { FUEL_STATION_PAGE_CONFIG } from './fuel-station-page.config';

@Component({
  selector: 'app-fuel-stations-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterSupplierComponent],
  template: `
    <app-master-wrapper 
      title="Catálogo de Gasolinerías" 
      icon="Gasolinera"
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar por nombre o dirección..."
      newButtonLabel="Nueva Estación de Gasolina"
      [disableNew]="!selectedSupplierId"
      (onSearch)="filtrar($event)"
      (onRefresh)="refresh()"
      (onSync)="sync()"
      (onNew)="onNewStation()">
      
      <div customFilters class="w-full sm:w-auto min-w-[250px]">
        <app-filter-supplier
          type="Fuel"
          placeholder="Seleccione Proveedor"
          [value]="selectedSupplierId"
          (onSupplierSelect)="onSupplierChanged($event)">
        </app-filter-supplier>
      </div>

      <div master class="h-full">
        @if (!selectedSupplierId) {
          <div class="flex flex-col items-center justify-center h-64 text-center p-6">
            <span class="text-4xl mb-4 opacity-50">👆</span>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Seleccione un Proveedor</h3>
            <p class="text-sm text-gray-500 mt-2 max-w-sm">Para ver o crear estaciones de gasolina, primero debe seleccionar un proveedor del filtro superior.</p>
          </div>
        } @else {
          <app-data-table 
            [data]="filteredItems()" 
            [columns]="pageConfig.tableColumns"
            [selectedItem]="selectedItem()"
            [isLoading]="isLoading()"
            (onRowSelect)="select($event)"
            (onEdit)="edit($event)"
            (onDelete)="delete($event)">
          </app-data-table>
        }
      </div>

      <div detail class="h-full flex flex-col">
        <app-detail-viewer 
          [data]="selectedItem()"
          [headerConfig]="pageConfig.detailHeader"
          [fields]="pageConfig.detailFields">
          
          @if (selectedItem()?.location) {
            <div class="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <a [href]="selectedItem()?.location" target="_blank" rel="noopener noreferrer" 
                 class="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-theme-primary dark:text-theme-secondary rounded-lg border border-gray-200 dark:border-gray-600 transition-colors font-medium text-sm">
                🗺️ Ver en Google Maps
              </a>
            </div>
          }
        </app-detail-viewer>
      </div>

    </app-master-wrapper>
  `
})
export class FuelStationsPageComponent extends BasePageController<FuelStationDTO> {
  protected apiService = inject(FuelStationService);
  private ngRouter = inject(Router);
  
  public pageConfig = FUEL_STATION_PAGE_CONFIG;
  selectedSupplierId: string = '';
  selectedSupplierContext: string = '';

  // Evitamos cargar los datos si no hay un proveedor seleccionado
  override async loadData(forceRefresh = false, urlParams?: any, queryParams?: any) {
    if (!this.selectedSupplierId) {
      this.rawData.set([]);
      this.isLoading.set(false);
      return;
    }
    await super.loadData(forceRefresh, { ...urlParams, id: this.selectedSupplierId }, queryParams);
  }

  onSupplierChanged(event: { id: string, contextText: string }) {
    this.selectedSupplierId = event.id;
    this.selectedSupplierContext = event.contextText;
    this.select(null); // Deseleccionar detalle
    this.loadData();
  }

  onNewStation() {
    if (!this.selectedSupplierId) return;
    this.ngRouter.navigate([this.pageConfig.mainRoute, 'new'], {
      queryParams: { 
        supplier_id: this.selectedSupplierId,
        context_text: this.selectedSupplierContext
      }
    });
  }
}
