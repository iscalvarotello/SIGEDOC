import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-gasoline-card',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './gasoline-card.component.html'
})
export class GasolineCardComponent {
  isLoading = input<boolean>(false);
}
