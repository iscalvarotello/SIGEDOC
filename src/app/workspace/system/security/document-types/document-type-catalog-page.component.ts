import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { DocumentTypeCatalogDTO } from './document-type-catalog.dto';
import { DocumentTypeCatalogService } from './document-type-catalog.service';
import { DOCUMENT_TYPE_CATALOG_PAGE_CONFIG } from './document-type-catalog-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { DismissAreacardComponent } from '@workspace-shared/components/common/dismiss-areacard/dismiss-areacard.component';

@Component({
  selector: 'app-document-type-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    MasterWrapperComponent,
    DataTableComponent,
    DetailViewerComponent,
    DismissAreacardComponent
  ],
  templateUrl: './document-type-catalog-page.component.html'
})
export class DocumentTypeCatalogPageComponent extends BasePageController<DocumentTypeCatalogDTO> {
  protected override apiService = inject(DocumentTypeCatalogService);
  public override pageConfig = DOCUMENT_TYPE_CATALOG_PAGE_CONFIG;
}
