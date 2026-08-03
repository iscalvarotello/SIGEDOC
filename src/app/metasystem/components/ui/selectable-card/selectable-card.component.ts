import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-selectable-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div 
      (click)="cardClick.emit()"
      class="group p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-1 min-w-0"
      [ngClass]="{
        'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800': active(),
        'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:hover:border-zinc-600': !active()
      }">
      
      <div class="flex items-center justify-between gap-2 min-w-0">
        <span class="text-sm font-bold text-gray-800 dark:text-zinc-100 truncate block" [title]="title()">
          {{ title() }}
        </span>
        @if (badge()) {
          <span class="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300">
            {{ badge() }}
          </span>
        }
      </div>
      
      @if (subtitle() || icon()) {
        <div class="flex items-center gap-1.5 min-w-0 mt-1">
          @if (icon()) {
            <icon [icon]="icon()!" class="w-3.5 h-3.5 shrink-0 text-gray-400"></icon>
          }
          <span class="text-xs text-gray-500 truncate block" [title]="subtitle()">
            {{ subtitle() }}
          </span>
        </div>
      }
      
      <ng-content></ng-content>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class SelectableCardComponent {
  title = input.required<string>();
  badge = input<string>('');
  subtitle = input<string>('');
  icon = input<string>('');
  active = input<boolean>(false);
  
  cardClick = output<void>();
}
