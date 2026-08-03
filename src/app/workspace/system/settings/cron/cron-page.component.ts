import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CronService } from './cron.service';
import { CronSettingDTO } from './cron.dto';
import { BasePageController } from '@baseclass/base-page.controller';

import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { CRON_PAGE_CONFIG } from './cron-page.config';

@Component({
  selector: 'app-cron-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './cron-page.component.html'
})
export class CronPageComponent extends BasePageController<CronSettingDTO> {
  protected override apiService = inject(CronService);
  public override pageConfig = CRON_PAGE_CONFIG;
}
