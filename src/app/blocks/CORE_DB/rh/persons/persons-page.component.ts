import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@app/shared/classes/base-page.controller';
import { PersonDTO } from './person.dto';
import { PersonService } from './person.service';
import { PERSONS_PAGE_CONFIG } from './persons-page.config';
import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';

@Component({
  selector: 'app-persons-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  templateUrl: './persons-page.component.html'
})
export class PersonsPageComponent extends BasePageController<PersonDTO> {
  protected override apiService = inject(PersonService);
  public override pageConfig = PERSONS_PAGE_CONFIG;
}
