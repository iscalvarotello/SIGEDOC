import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { RoleDTO } from './role.dto';
import { RoleService } from './role.service';
import { ROLES_PAGE_CONFIG } from './roles-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { DismissAreacardComponent } from '@workspace-shared/components/common/dismiss-areacard/dismiss-areacard.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule,
    MasterWrapperComponent,
    DataTableComponent,
    DetailViewerComponent,
    DismissAreacardComponent
  ],
  templateUrl: './roles-page.component.html'
})
export class RolesPageComponent extends BasePageController<RoleDTO> {
  protected override apiService = inject(RoleService);
  public override pageConfig = ROLES_PAGE_CONFIG;
}
