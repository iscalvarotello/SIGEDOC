import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-sent-document-card',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './sent-document-card.component.html'
})
export class SentDocumentCardComponent {
  stats = input.required<any>();
  isLoading = input<boolean>(false);
}
