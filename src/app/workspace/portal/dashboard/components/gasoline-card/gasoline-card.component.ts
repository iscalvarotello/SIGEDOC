import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-gasoline-card',
  standalone: true,
  imports: [DashboardCardComponent, IconComponent],
  templateUrl: './gasoline-card.component.html'
})
export class GasolineCardComponent {
  isLoading = input<boolean>(false);
}

