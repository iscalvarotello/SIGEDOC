import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      // Remove any hardcoded SIGEDOC prefix if they exist in legacy code
      let cleanTitle = title;
      if (cleanTitle.startsWith('SIGEDOC | ')) {
        cleanTitle = cleanTitle.replace('SIGEDOC | ', '');
      } else if (cleanTitle.startsWith('Husky | ')) {
        cleanTitle = cleanTitle.replace('Husky | ', '');
      }
      
      this.title.setTitle(`${APP_SETTINGS.SYSTEM_NAME} | ${cleanTitle}`);
    } else {
      this.title.setTitle(APP_SETTINGS.PAGE_TITLE_FORMAT);
    }
  }
}
