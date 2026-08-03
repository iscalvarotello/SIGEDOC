import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-sent-document-card',
  standalone: true,
  imports: [DashboardCardComponent, IconComponent],
  templateUrl: './sent-document-card.component.html'
})
export class SentDocumentCardComponent {
  stats = input.required<any>();
  isLoading = input<boolean>(false);
}

