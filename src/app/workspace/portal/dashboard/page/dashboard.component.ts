import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, OnInit, inject, computed, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { SesionService } from '@services/sesion.service';
import { DocumentService } from '@documentos/services/document.service';
import { DocStatsService } from '../services/doc-stats.service';
import { ReceivedDocumentCardComponent } from '../components/received-document-card/received-document-card.component';
import { SentDocumentCardComponent } from '../components/sent-document-card/sent-document-card.component';
import { IncidentsCardComponent } from '../components/incidents-card/incidents-card.component';
import { GasolineCardComponent } from '../components/gasoline-card/gasoline-card.component';
import { ViaticosCardComponent } from '../components/viaticos-card/viaticos-card.component';

interface DashboardConfig {
  showReceivedDocs: boolean;
  showSentDocs: boolean;
  showIncidents: boolean;
  showGasoline: boolean;
  showViaticos: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReceivedDocumentCardComponent,
    SentDocumentCardComponent,
    IncidentsCardComponent,
    GasolineCardComponent,
    ViaticosCardComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  appSettings = APP_SETTINGS;
  private http = inject(HttpClient);
  private sesionService = inject(SesionService);
  private documentService = inject(DocumentService);
  private docStatsService = inject(DocStatsService);

  dashboardConfig = signal<DashboardConfig>({
    showReceivedDocs: true,
    showSentDocs: true,
    showIncidents: false,
    showGasoline: false,
    showViaticos: false
  });

  rawDocuments = signal<any[]>([]);
  isLoading = signal<boolean>(false);

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

  stats = computed(() => {
    return this.docStatsService.calculateStats(this.rawDocuments());
  });

  constructor() {
    effect(() => {
      const ads = this.sesionService.activeAdscription();
      if (ads && ads.id_area) {
        this.loadDashboardStats(ads.id_area);
      } else {
        this.rawDocuments.set([]);
      }
    });
  }

  ngOnInit() {
    this.verifySession();
    this.loadDashboardConfig();
  }

  loadDashboardConfig() {
    const saved = localStorage.getItem(APP_SETTINGS.STORAGE_DASHBOARD_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.dashboardConfig.set({
          showReceivedDocs: parsed.showReceivedDocs !== false,
          showSentDocs: parsed.showSentDocs !== false,
          showIncidents: !!parsed.showIncidents,
          showGasoline: !!parsed.showGasoline,
          showViaticos: !!parsed.showViaticos
        });
      } catch (e) {
        console.error('Error parsing dashboard config:', e);
      }
    }
  }

  async verifySession() {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    try {
      await firstValueFrom(this.http.get(`${baseUrl}/auth/verify`));
    } catch (err) {
      console.error('Session validation failed:', err);
    }
  }

  async loadDashboardStats(areaId: string) {
    this.isLoading.set(true);
    try {
      const res = await this.documentService.getInbox(areaId);
      this.rawDocuments.set(res?.data || []);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      this.rawDocuments.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
