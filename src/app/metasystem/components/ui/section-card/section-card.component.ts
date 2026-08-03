import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-section-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="bg-white dark:bg-gray-900 shadow-sm border border-gray-150 dark:border-gray-800 rounded-xl p-4 h-fit flex flex-col" [ngClass]="containerClass()">
      <h4 class="text-[10px] font-black text-theme-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">
        @if (icon()) {
          <icon [icon]="icon()" class="w-3.5 h-3.5 text-theme-secondary"></icon>
        }
        <span>{{ title() }}</span>
        
        @if (isLoading()) {
          <span class="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-theme-primary ml-auto shrink-0"></span>
        } @else {
          <div class="ml-auto flex items-center gap-2">
            <ng-content select="[header-actions]"></ng-content>
          </div>
        }
      </h4>
      
      <div class="flex-1 flex flex-col min-h-0 relative" [ngClass]="contentClass()">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class SectionCardComponent {
  title = input.required<string>();
  icon = input<string>('');
  isLoading = input<boolean>(false);
  containerClass = input<string>('');
  contentClass = input<string>('');
}
