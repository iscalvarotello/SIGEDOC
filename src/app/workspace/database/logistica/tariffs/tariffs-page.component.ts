import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BasePageController } from '@baseclass/base-page.controller';
import { TariffMatrixDTO } from './tariff.dto';
import { TariffService } from './tariff.service';
import { TARIFFS_PAGE_CONFIG } from './tariffs-page.config';

import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { MatrixTableComponent } from '@system-shared/master-detail/matrix-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';

@Component({
  selector: 'app-tariffs-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterWrapperComponent, DataTableComponent, MatrixTableComponent, DetailViewerComponent],
  templateUrl: './tariffs-page.component.html'
})
export class TariffsPageComponent extends BasePageController<TariffMatrixDTO> {
  protected override apiService = inject(TariffService);
  protected override router = inject(Router);

  public override pageConfig = TARIFFS_PAGE_CONFIG;
  
  // Año activo (por defecto el año actual)
  public activeYear = signal<number>(new Date().getFullYear());

  constructor() {
    super();
    // Configuramos los parámetros para que use la ruta especial getMatrix
    this.pageConfig.fetchRoute = 'getMatrix';
    this.activeUrlParams = { year: this.activeYear() };
  }

  // Método para cuando el usuario cambia el año en el input de la UI
  public onYearChange(newYear: number) {
    if (newYear && newYear > 2000 && newYear < 2100) {
      this.activeYear.set(newYear);
      this.activeUrlParams = { year: newYear };
      // Limpiamos selección y refrescamos los datos de red
      this.selectedItem.set(null);
      this.loadData(true);
    }
  }

  public editar(id: string | number) {
    this.router.navigate(['/database/logistic/tariffs', id]);
  }

  public override nuevo() {
    this.router.navigate(['/database/logistic/tariffs/new']);
  }
}
