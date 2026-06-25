import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@app/shared/classes/base-page.controller';
import { DistanceDTO } from './distance.dto';
import { DistanceService } from './distance.service';
import { DISTANCES_PAGE_CONFIG } from './distances-page.config';
import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';
import { FilterCityComponent } from '@app/shared/components/filters/filter-city.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-distances-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterCityComponent],
  templateUrl: './distances-page.component.html'
})
export class DistancesPageComponent extends BasePageController<DistanceDTO> {
  protected override apiService = inject(DistanceService);
  public override pageConfig = DISTANCES_PAGE_CONFIG;
  private route = inject(ActivatedRoute);

  selectedCountryId = '';
  selectedStateId = '';

  override ngOnInit() {
    super.ngOnInit();
    
    // Si viene origin_city_id por query params (ej. al regresar del formulario)
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['origin_city_id']) {
      this.selectedCountryId = queryParams['origin_country_id'] || '';
      this.selectedStateId = queryParams['origin_state_id'] || '';
      this.activeUrlParams = { 
        originCityId: queryParams['origin_city_id'],
        originCountryId: queryParams['origin_country_id'] || '',
        originStateId: queryParams['origin_state_id'] || ''
      };
      this.loadData(true, this.activeUrlParams);
    }
  }

  onOriginCountryChange(event: { countryId: string }) {
    this.selectedCountryId = event.countryId;
  }

  onOriginStateChange(event: { stateId: string }) {
    this.selectedStateId = event.stateId;
  }

  onOriginCityChange(event: { cityId: string }) {
    if (event.cityId) {
      // Guardamos el parámetro y recargamos usando la ruta especial que definimos en la config
      this.activeUrlParams = { 
        originCityId: event.cityId,
        originCountryId: this.selectedCountryId,
        originStateId: this.selectedStateId
      };
      this.loadData(true, this.activeUrlParams);
    } else {
      // Si no hay ciudad, vaciamos la tabla
      this.activeUrlParams = undefined;
      this.rawData.set([]);
    }
  }

  // Sobrescribimos el método de nuevo para pasar el origin_city_id seleccionado por queryParam
  override nuevo() {
    const queryParams: any = {};
    if (this.activeUrlParams?.originCityId) {
      queryParams['origin_city_id'] = this.activeUrlParams.originCityId;
      if (this.selectedCountryId) {
        queryParams['origin_country_id'] = this.selectedCountryId;
      }
      if (this.selectedStateId) {
        queryParams['origin_state_id'] = this.selectedStateId;
      }
    }
    this.router.navigate([this.pageConfig.mainRoute, 'new'], { queryParams });
  }

  override edit(item: any) {
    const queryParams: any = {};
    if (this.activeUrlParams?.originCityId) {
      queryParams['origin_city_id'] = this.activeUrlParams.originCityId;
      if (this.selectedCountryId) {
        queryParams['origin_country_id'] = this.selectedCountryId;
      }
      if (this.selectedStateId) {
        queryParams['origin_state_id'] = this.selectedStateId;
      }
    }
    this.router.navigate([this.pageConfig.mainRoute, item.id], { queryParams });
  }
}
