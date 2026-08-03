import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
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
    const saved = localStorage.getItem('sigedoc_dashboard_config');
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
    localStorage.setItem('sigedoc_dashboard_config', JSON.stringify(updated));
  }
}
