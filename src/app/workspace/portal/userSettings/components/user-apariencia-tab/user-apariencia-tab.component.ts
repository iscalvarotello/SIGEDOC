import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from "@app/metasystem/components/ui/title/title.component";
import { GeneralBubbleComponent } from "@app/metasystem/components/ui/general-bubble/general-bubble.component";
import { ActionButtonComponent } from "@app/metasystem/components/buttons";
import { ThemeService } from '@app/metasystem/themes/theme.service';
import { THEMES } from '@app/metasystem/settings/app.settings';

@Component({
  selector: 'app-user-apariencia-tab',
  standalone: true,
  imports: [CommonModule, TitleComponent, GeneralBubbleComponent],
  templateUrl: './user-apariencia-tab.component.html'
})
export class UserAparienciaTabComponent {
  public themeService = inject(ThemeService);

  public availableThemes = Object.keys(THEMES).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  public setTheme(themeId: string) {
    this.themeService.setTheme(themeId);
  }
}
