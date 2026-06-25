import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@app/shared/classes/base-page.controller';
import { CarDTO } from './car.dto';
import { CarService } from './car.service';
import { CARS_PAGE_CONFIG } from './cars-page.config';
import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';

@Component({
  selector: 'app-cars-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './cars-page.component.html'
})
export class CarsPageComponent extends BasePageController<CarDTO> {
  protected override apiService = inject(CarService);
  public override pageConfig = CARS_PAGE_CONFIG;
}
