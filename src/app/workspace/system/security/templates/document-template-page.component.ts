import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { DocumentTemplateDTO } from './document-template.dto';
import { DocumentTemplateService } from './document-template.service';
import { DOCUMENT_TEMPLATE_PAGE_CONFIG } from './document-template-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { DismissAreacardComponent } from '@workspace-shared/components/common/dismiss-areacard/dismiss-areacard.component';

@Component({
  selector: 'app-document-templates-page',
  standalone: true,
  imports: [
    CommonModule,
    MasterWrapperComponent,
    DataTableComponent,
    DetailViewerComponent,
    DismissAreacardComponent
  ],
  templateUrl: './document-template-page.component.html'
})
export class DocumentTemplatesPageComponent extends BasePageController<DocumentTemplateDTO> {
  protected override apiService = inject(DocumentTemplateService);
  public override pageConfig = DOCUMENT_TEMPLATE_PAGE_CONFIG;
}
