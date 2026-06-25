import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@app/shared/classes/base-page.controller';
import { DocumentTemplateDTO } from './document-template.dto';
import { DocumentTemplateService } from './document-template.service';
import { DOCUMENT_TEMPLATE_PAGE_CONFIG } from './document-template-page.config';
import { MasterWrapperComponent } from '@app/shared/components/master-detail/master-wrapper.component';
import { DataTableComponent } from '@app/shared/components/master-detail/data-table.component';
import { DetailViewerComponent } from '@app/shared/components/master-detail/detail-viewer.component';
import { DismissAreacardComponent } from '@app/shared/components/common/dismiss-areacard/dismiss-areacard.component';

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
