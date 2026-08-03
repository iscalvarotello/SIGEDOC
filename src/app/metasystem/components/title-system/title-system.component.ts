import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-title-system',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <div class="w-full" [ngClass]="containerClass()">
      <div class="shrink-0 flex items-center" [ngClass]="inline() ? appSettings.LOGO_INLINE_MARGIN : ''">
        <!-- Logo del Sistema -->
        <logo [isIcon]="true" [width]="logoWidth()" [height]="logoHeight()"></logo>
      </div>
      
      <div class="flex flex-col w-full" [ngClass]="textContainerClass()">
        <h1 class="font-black text-theme-primary dark:text-white tracking-tight leading-none whitespace-normal break-words" [ngClass]="titleSize() || 'text-theme-title'">
          {{ appSettings.SYSTEM_NAME }}
        </h1>
        <p class="font-bold text-theme-secondary dark:text-white uppercase leading-[1.2] whitespace-normal break-words" [ngClass]="[sloganSize() || 'text-theme-xs', inline() ? 'mt-1.5' : 'mt-2']">
          {{ appSettings.SYSTEM_SLOGAN }}
        </p>
      </div>
    </div>
  `
})
export class TitleSystemComponent {
  appSettings = APP_SETTINGS;
  align = input<'left' | 'center' | 'right'>('center');
  inline = input<boolean>(false);
  
  logoWidth = input<number | string>(APP_SETTINGS.LOGO_WIDTH);
  logoHeight = input<number | string>(APP_SETTINGS.LOGO_HEIGHT);
  
  titleSize = input<string>('');
  sloganSize = input<string>('');

  containerClass() {
    if (this.inline()) {
      return 'flex flex-row items-center overflow-hidden ' + this.appSettings.LOGO_INLINE_GAP;
    }
    return 'flex flex-col space-y-4 ' + this.alignClass();
  }
  
  textContainerClass() {
    if (this.inline()) {
      return 'flex-1 min-w-0 justify-center';
    }
    return 'space-y-1 ' + this.alignClass();
  }

  alignClass() {
    switch (this.align()) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      case 'center': default: return 'items-center text-center';
    }
  }
}
