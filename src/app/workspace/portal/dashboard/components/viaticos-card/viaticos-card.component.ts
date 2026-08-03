import { Component, input } from '@angular/core';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-viaticos-card',
  standalone: true,
  imports: [DashboardCardComponent, IconComponent],
  templateUrl: './viaticos-card.component.html'
})
export class ViaticosCardComponent {
  isLoading = input<boolean>(false);
}

