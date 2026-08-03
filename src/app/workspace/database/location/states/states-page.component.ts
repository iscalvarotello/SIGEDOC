import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { StateDTO } from './state.dto';
import { StateService } from './state.service';
import { STATE_PAGE_CONFIG } from './state-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { FilterCountryComponent } from '@system-shared/filters/filter-country.component';

@Component({
  selector: 'app-states-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterCountryComponent],
  templateUrl: './states-page.component.html'
})
export class StatesPageComponent extends BasePageController<StateDTO> {
  protected apiService = inject(StateService);
  public pageConfig = STATE_PAGE_CONFIG;
onCountryChanged(event: { countryId: string }) {
    // Cuando el filtro cambia, le decimos a BasePageController que dispare loadData
    // mandándole el countryId como un urlParam, lo que inyectará :countryId en la ruta especial
    this.loadData(false, { countryId: event.countryId });
  }
}
