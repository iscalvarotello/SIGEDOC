import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule               } from '@angular/common';
import { ActivatedRoute             } from '@angular/router';
import { PageBreadcrumbComponent    } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonTabComponent         } from '@system-shared/buttons/button-tab/button-tab.component';
import { UserEmployeeTabComponent   } from '../components/user-employee-tab/user-employee-tab.component';
import { UserAreaTabComponent       } from '../components/user-area-tab/user-area-tab.component';
import { UserDashboardTabComponent  } from '../components/user-dashboard-tab/user-dashboard-tab.component';
import { UserFirmaTabComponent      } from '../components/user-firma-tab/user-firma-tab.component';
import { UserAparienciaTabComponent } from "../components/user-apariencia-tab/user-apariencia-tab.component";

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserEmployeeTabComponent,
    UserAreaTabComponent,
    UserDashboardTabComponent,
    UserFirmaTabComponent,
    ButtonTabComponent,
    UserAparienciaTabComponent
],
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  // Pestaña activa
  currentTab = signal<'employee' | 'area' | 'dashboard' | 'firma' | 'apariencia'>('employee');

  ngOnInit() {
    // Escuchar cambios de pestaña por query parameters
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'area') {
        this.currentTab.set('area');
      } else if (tab === 'dashboard') {
        this.currentTab.set('dashboard');
      } else if (tab === 'firma') {
        this.currentTab.set('firma');
      } else if (tab === 'apariencia') {
        this.currentTab.set('apariencia');
      } else {
        this.currentTab.set('employee');
      }
    });
  }

  setTab(tab: 'employee' | 'area' | 'dashboard' | 'firma' | 'apariencia') {
    this.currentTab.set(tab);
  }
}
