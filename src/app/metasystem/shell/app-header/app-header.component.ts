import { Component, ViewChild } from '@angular/core';
import { SidebarService } from '../app-sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '@system-shared/common/theme-toggle/theme-toggle-button.component';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '@user-settings/components/user-dropdown/user-dropdown.component';
import { AdscriptionSelectorComponent } from './components/adscription-selector/adscription-selector.component';
import { LogoComponent } from '@metasystem/components/logo/logo.component';
import { ToggleIconButtonComponent } from '@system-shared/buttons/toggle-icon-button/toggle-icon-button.component';
import { IconButtonComponent } from '@system-shared/buttons/icon-button/icon-button.component';
import { SearchInputComponent } from '@system-shared/form/search-input/search-input.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    AdscriptionSelectorComponent, 
    LogoComponent, 
    ToggleIconButtonComponent,
    IconButtonComponent,
    SearchInputComponent],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  @ViewChild('searchInput') searchInput!: SearchInputComponent;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.focus();
    }
  };
}

