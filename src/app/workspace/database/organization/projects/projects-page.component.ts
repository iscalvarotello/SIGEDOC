import { Component, computed, inject } from '@angular/core';
import { CommonModule           } from '@angular/common';
import { BasePageController     } from '@baseclass/base-page.controller';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent     } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent  } from '@system-shared/master-detail/detail-viewer.component';
import { ProjectDTO             } from './project.dto';
import { ProjectService         } from './project.service';
import { PROJECT_PAGE_CONFIG    } from './project-page.config';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent],
  template: `
    <app-master-wrapper 
      title="Catálogo de Proyectos" 
      icon="Documentos"
      [layoutSpan]="{ master: 7, detail: 5 }"
      [searchTerm]="searchTerm()"
      searchPlaceholder="Buscar proyectos..."
      (onSearch)="filtrar($event)"
      (onRefresh)="refresh()"
      (onSync)="sync()"
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
        <app-detail-viewer 
          [data]="selectedItem()"
          [headerConfig]="pageConfig.detailHeader"
          [fields]="pageConfig.detailFields">
        </app-detail-viewer>
      </div>

    </app-master-wrapper>
  `
})
export class ProjectsPageComponent extends BasePageController<ProjectDTO> {
  protected apiService = inject(ProjectService);
  public pageConfig = PROJECT_PAGE_CONFIG;
}
