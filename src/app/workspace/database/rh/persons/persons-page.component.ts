import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { PersonDTO } from './person.dto';
import { PersonService } from './person.service';
import { PERSONS_PAGE_CONFIG } from './persons-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';

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
