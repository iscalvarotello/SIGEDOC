import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { CityDTO } from './city.dto';
import { CityService } from './city.service';
import { CITY_PAGE_CONFIG } from './city-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { FilterStateComponent } from '@system-shared/filters/filter-state.component';

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
onStateChanged(event: { stateId: string, countryId: string, contextText?: string }) {
    if (event.stateId) {
      this.selectedStateContext = event.contextText || '';
      this.loadData(false, { stateId: event.stateId, countryId: event.countryId });
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
