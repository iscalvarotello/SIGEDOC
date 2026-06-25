import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-incidents-card',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './incidents-card.component.html'
})
export class IncidentsCardComponent {
  isLoading = input<boolean>(false);
}
