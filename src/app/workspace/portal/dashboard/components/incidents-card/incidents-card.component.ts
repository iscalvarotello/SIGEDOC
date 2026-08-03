import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-incidents-card',
  standalone: true,
  imports: [DashboardCardComponent, IconComponent],
  templateUrl: './incidents-card.component.html'
})
export class IncidentsCardComponent {
  isLoading = input<boolean>(false);
}

