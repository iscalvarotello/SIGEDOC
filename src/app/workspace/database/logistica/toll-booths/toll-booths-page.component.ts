import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { TollBoothDTO } from './toll-booth.dto';
import { TollBoothService } from './toll-booth.service';
import { TOLL_BOOTHS_PAGE_CONFIG } from './toll-booths-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';

@Component({
  selector: 'app-toll-booths-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './toll-booths-page.component.html'
})
export class TollBoothsPageComponent extends BasePageController<TollBoothDTO> {
  protected apiService = inject(TollBoothService);
  public pageConfig = TOLL_BOOTHS_PAGE_CONFIG;
}
