import { SmartImageComponent } from '@system-shared/images/index';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleTwoComponent } from '@system-shared/common/theme-toggle-two/theme-toggle-two.component';
import { TenantService } from '@core/services/tenant.service';

@Component({
  selector: 'app-auth-page-layout',
  imports: [
    RouterModule,
    ThemeToggleTwoComponent, SmartImageComponent],
  templateUrl: './auth-page-layout.component.html',
  styles: ``
})
export class AuthPageLayoutComponent {
  appSettings = APP_SETTINGS;
  public tenantService = inject(TenantService);
}
