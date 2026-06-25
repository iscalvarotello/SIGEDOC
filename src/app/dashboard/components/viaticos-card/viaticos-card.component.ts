import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-viaticos-card',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './viaticos-card.component.html'
})
export class ViaticosCardComponent {
  isLoading = input<boolean>(false);
}
