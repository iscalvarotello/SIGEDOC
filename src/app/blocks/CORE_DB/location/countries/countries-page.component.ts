import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryService } from './country.service';
import { CountryDTO } from './country.dto';
import { BasePageController } from '@app/shared/classes/base-page.controller';

import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';
import { COUNTRY_PAGE_CONFIG } from './country-page.config';

@Component({
  selector: 'app-countries-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './countries-page.component.html'
})
export class CountriesPageComponent extends BasePageController<CountryDTO> {
  
  // 1. Inyectamos nuestro servicio específico
  protected override apiService = inject(CountryService);

  // 2. Definimos la configuración para esta página
  public override pageConfig = COUNTRY_PAGE_CONFIG;
}
