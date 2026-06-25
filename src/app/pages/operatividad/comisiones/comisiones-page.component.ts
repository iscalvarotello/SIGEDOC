import { Component, OnInit, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SesionService } from '../../../shared/services/sesion.service';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';

@Component({
  selector: 'app-comisiones-page',
  standalone: true,
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
  ],
  templateUrl: './comisiones-page.component.html',
})
export class ComisionesPageComponent implements OnInit {
  private http = inject(HttpClient);
  private sesionService = inject(SesionService);

  userName = computed(() => {
    return this.sesionService.dataUser.fullName || 'Usuario';
  });

  activeAreaName = computed<string>(() => {
    const ads = this.sesionService.activeAdscription();
    return ads ? ads.nombre_area : '';
  });

  todayDate = computed(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date();
    const formatted = date.toLocaleDateString('es-MX', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  ngOnInit() {
    this.verifySession();
  }

  async verifySession() {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    try {
      await firstValueFrom(this.http.get(`${baseUrl}/auth/verify`));
    } catch (err) {
      console.error('Session validation failed:', err);
    }
  }
}
