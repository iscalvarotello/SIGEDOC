import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerImageComponent } from '@system-shared/images/index';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'avatar-button',
  standalone: true,
  imports: [CommonModule, ServerImageComponent, IconComponent],
  template: `
    <button class="flex w-full items-center text-gray-700 dropdown-toggle dark:text-gray-400">
      <div class="mr-3 w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
        @if (userId()) {
          <server-image 
            endpointKey="users" 
            routeKey="getProfilePhoto" 
            [params]="{id: userId()}"
            [reloadTrigger]="reloadTrigger()"
            fallbackIcon="AvatarPremium"
            imgClass="w-full h-full object-cover">
          </server-image>
        } @else {
          <icon icon="AvatarPremium" class="w-full h-full text-gray-400 p-2"></icon>
        }
      </div>
      <span class="block mr-1 font-medium text-theme-sm">
        <ng-content></ng-content>
      </span>
      <icon icon="ChevronDown" [rotate]="isOpen()" variant="muted" class="w-4 h-5"></icon>
    </button>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class AvatarButtonComponent {
  userId = input<number | string | null>(null);
  reloadTrigger = input<any>();
  isOpen = input<boolean>(false);
}
