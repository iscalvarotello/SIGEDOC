import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

@Component({
  selector: 'app-auth-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1 w-full" [ngClass]="alignClass()">
      @if (subtitle()) {
        <h2 class="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase min-h-4">
          {{ subtitle() }}
        </h2>
      }
      <h1 class="font-black text-theme-primary dark:text-theme-secondary tracking-tight leading-none" [ngClass]="appSettings.FONT_SIZE_TITLE">
        {{ appSettings.SYSTEM_NAME }}
      </h1>
      <p class="font-bold text-gray-600 dark:text-gray-300 uppercase mt-2" [ngClass]="appSettings.FONT_SIZE_SLOGAN">
        {{ appSettings.SYSTEM_SLOGAN }}
      </p>
    </div>
  `
})
export class AuthTitleComponent {
  appSettings = APP_SETTINGS;
  align = input<'left' | 'center' | 'right'>('center');
  subtitle = input<string>('');

  alignClass() {
    switch (this.align()) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      case 'center': default: return 'items-center text-center';
    }
  }
}
