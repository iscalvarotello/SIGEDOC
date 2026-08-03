import { } from '@system-shared/images/index';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GridShapeComponent } from '@system-shared/common/grid-shape/grid-shape.component';
import { ThemeToggleTwoComponent } from '@system-shared/common/theme-toggle-two/theme-toggle-two.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GridShapeComponent,
    ThemeToggleTwoComponent,
    IconComponent
  , ActionButtonComponent],
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent {
  appSettings = APP_SETTINGS;
  private router = inject(Router);

  retry() {
    this.router.navigate(['/signin']);
  }
}
