import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '@system-shared/ui/title/title.component';

interface DashboardConfig {
  showReceivedDocs: boolean;
  showSentDocs: boolean;
  showIncidents: boolean;
  showGasoline: boolean;
  showViaticos: boolean;
}

@Component({
  selector: 'app-user-dashboard-tab',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './user-dashboard-tab.component.html'
})
export class UserDashboardTabComponent implements OnInit {
  dashboardConfig = signal<DashboardConfig>({
    showReceivedDocs: true,
    showSentDocs: true,
    showIncidents: false,
    showGasoline: false,
    showViaticos: false
  });

  ngOnInit() {
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
        // Fallback standard
      }
    } else {
      this.dashboardConfig.set({
        showReceivedDocs: true,
        showSentDocs: true,
        showIncidents: false,
        showGasoline: false,
        showViaticos: false
      });
    }
  }

  toggleDashboardCard(cardKey: keyof DashboardConfig) {
    const current = this.dashboardConfig();
    const updated = {
      ...current,
      [cardKey]: !current[cardKey]
    };
    this.dashboardConfig.set(updated);
    localStorage.setItem(APP_SETTINGS.STORAGE_DASHBOARD_CONFIG, JSON.stringify(updated));
  }
}
