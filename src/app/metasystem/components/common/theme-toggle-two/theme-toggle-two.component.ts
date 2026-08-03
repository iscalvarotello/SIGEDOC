import { Component } from '@angular/core';
import { ThemeService } from '@services/theme.service';
import { } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-theme-toggle-two',
  imports: [ActionButtonComponent],
  templateUrl: './theme-toggle-two.component.html',
  styles: ``
})
export class ThemeToggleTwoComponent {

  theme$;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
