import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@app/shared/classes/base-page.controller';
import { JobPositionDTO } from './job-position.dto';
import { JobPositionService } from './job-position.service';
import { JOB_POSITIONS_PAGE_CONFIG } from './job-positions-page.config';
import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';

@Component({
  selector: 'app-job-positions-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './job-positions-page.component.html'
})
export class JobPositionsPageComponent extends BasePageController<JobPositionDTO> {
  protected override apiService = inject(JobPositionService);
  public override pageConfig = JOB_POSITIONS_PAGE_CONFIG;
}
