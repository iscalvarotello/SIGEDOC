import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'general-bubble',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div 
      class="flex gap-4 p-4 border border-gray-150 dark:border-gray-800 rounded-2xl"
      [ngClass]="[backcolor(), orientation() === 'horizontal' ? 'flex-col sm:flex-row justify-between items-start sm:items-center' : 'flex-col']">
      
      <div class="flex items-start gap-3.5">
        @if (icon()) {
          <icon [icon]="icon()" class="shrink-0 mt-0.5 w-6 h-6" [ngClass]="iconColorClass()"></icon>
        }
        <div class="flex flex-col">
          <span 
            class="text-xs font-bold uppercase tracking-wider" 
            [class.text-gray-700]="!parsedTitleColor() && !titleColorClass()" 
            [class.dark:text-gray-300]="!parsedTitleColor() && !titleColorClass()"
            [ngClass]="titleColorClass()"
            [ngStyle]="parsedTitleColor() ? {'color': parsedTitleColor()} : {}"
            [innerHTML]="title()">
          </span>
          @if (subtitle()) {
            <span 
              class="text-xs mt-0.5" 
              [class.text-gray-400]="!parsedSubtitleColor() && !subtitleColorClass()"
              [ngClass]="subtitleColorClass()"
              [ngStyle]="parsedSubtitleColor() ? {'color': parsedSubtitleColor()} : {}"
              [innerHTML]="subtitle()">
            </span>
          }
        </div>
      </div>
      
      <div [ngClass]="[orientation() === 'horizontal' ? 'flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end' : 'mt-1']">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class GeneralBubbleComponent {
  title = input<string>('');
  subtitle = input<string>('');
  backcolor = input<string>('bg-gray-50/50 dark:bg-gray-950/20');
  textColor = input<string>('');
  titleColorClass = input<string>('');
  subtitleColorClass = input<string>('');
  icon = input<string>('');
  iconColorClass = input<string>('');
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  parsedTitleColor = computed(() => {
    const val = this.textColor();
    if (!val) return '';
    return val.split('|')[0] || '';
  });

  parsedSubtitleColor = computed(() => {
    const val = this.textColor();
    if (!val) return '';
    const parts = val.split('|');
    return parts[1] || '';
  });
}
