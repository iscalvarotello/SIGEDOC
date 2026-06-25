import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-received-document-card',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './received-document-card.component.html'
})
export class ReceivedDocumentCardComponent {
  stats = input.required<any>();
  isLoading = input<boolean>(false);
}
