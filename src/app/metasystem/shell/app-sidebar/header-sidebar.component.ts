import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '@metasystem/components/logo/logo.component';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

import { TitleSystemComponent } from '@metasystem/components/title-system/title-system.component';

@Component({
  selector: 'app-header-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleSystemComponent, LogoComponent],
  template: `
    <a routerLink="/" class="flex flex-row items-center overflow-hidden w-full h-full">
      @if (isExpanded() || isHovered() || isMobileOpen()) {
        <app-title-system 
          [inline]="true" 
          [logoWidth]="appSettings.LOGO_EXPAND_SIZE" 
          [logoHeight]="appSettings.LOGO_EXPAND_SIZE">
        </app-title-system>
      } @else {
        <!-- Collapsed Logo -->
        <div class="w-full flex justify-center">
          <logo [isIcon]="true" [width]="appSettings.LOGO_COLLAPSE_SIZE" [height]="appSettings.LOGO_COLLAPSE_SIZE"></logo>
        </div>
      }
    </a>
  `
})
export class HeaderSidebarComponent {
  appSettings = APP_SETTINGS;
  
  isExpanded = input.required<boolean | null>();
  isHovered = input.required<boolean | null>();
  isMobileOpen = input.required<boolean | null>();
}
