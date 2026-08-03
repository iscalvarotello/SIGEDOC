import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-received-document-card',
  standalone: true,
  imports: [DashboardCardComponent, IconComponent],
  templateUrl: './received-document-card.component.html'
})
export class ReceivedDocumentCardComponent {
  stats = input.required<any>();
  isLoading = input<boolean>(false);
}

