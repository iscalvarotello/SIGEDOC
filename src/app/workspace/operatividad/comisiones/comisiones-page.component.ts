import { Component, OnInit, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SesionService } from '@services/sesion.service';

import { APP_SETTINGS } from '@metasystem/settings/app.settings';

@Component({
  selector: 'app-comisiones-page',
  standalone: true,
  imports: [],
  templateUrl: './comisiones-page.component.html',
})
export class ComisionesPageComponent implements OnInit {
  appSettings = APP_SETTINGS;
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
