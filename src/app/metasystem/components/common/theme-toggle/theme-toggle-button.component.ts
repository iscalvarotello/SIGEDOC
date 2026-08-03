import { Component } from '@angular/core';
import { ThemeService } from '@services/theme.service';
import { CommonModule } from '@angular/common';
import { } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-theme-toggle-button',
  templateUrl: './theme-toggle-button.component.html',
  imports: [CommonModule, ActionButtonComponent]
})
export class ThemeToggleButtonComponent {
  
  theme$;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}