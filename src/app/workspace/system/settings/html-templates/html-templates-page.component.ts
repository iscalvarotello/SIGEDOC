import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { HtmlTemplate } from './interfaces/html-template.interface';
import { HtmlTemplateService } from './services/html-template.service';
import { HTML_TEMPLATE_PAGE_CONFIG } from './html-template-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';

@Component({
  selector: 'app-html-templates-page',
  standalone: true,
  imports: [
    CommonModule,
    MasterWrapperComponent,
    DataTableComponent,
    DetailViewerComponent
  ],
  template: `
    <app-master-wrapper 
      title="Plantillas HTML" 
      subtitle="Gestión del aspecto visual para documentos"
      icon="Documentos"
      [layoutSpan]="{ master: 7, detail: 5 }"
      [serverError]="serverError()"
      searchPlaceholder="Buscar por nombre..."
      (onSearch)="filtrar($event)"
      (onRefresh)="refresh()"
      (onNew)="nuevo()">
      
      <div master class="h-full">
        <app-data-table 
          [data]="filteredItems()" 
          [columns]="pageConfig.tableColumns"
          [selectedItem]="selectedItem()"
          [isLoading]="isLoading()"
          (onRowSelect)="select($event)"
          (onEdit)="edit($event)"
          (onDelete)="delete($event)">
        </app-data-table>
      </div>

      <div detail class="h-full flex flex-col">
        @if (selectedItem()) {
          <app-detail-viewer 
            [data]="selectedItem()"
            [headerConfig]="pageConfig.detailHeader"
            [fields]="pageConfig.detailFields">
          </app-detail-viewer>
        } @else {
          <div class="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-500">
            Ninguna plantilla seleccionada. Haga clic en un elemento de la lista para ver sus detalles.
          </div>
        }
      </div>

    </app-master-wrapper>
  `
})
export class HtmlTemplatesPageComponent extends BasePageController<HtmlTemplate> {
  protected override apiService = inject(HtmlTemplateService);
  public override pageConfig = HTML_TEMPLATE_PAGE_CONFIG;
}
