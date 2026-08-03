import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
    IconComponent
  ],
  templateUrl: './page-breadcrumb.component.html',
  styles: ``
})
export class PageBreadcrumbComponent {
  @Input() pageTitle = '';
  @Input() badgeLabel = '';
  @Input() badgeValue = '';
}
