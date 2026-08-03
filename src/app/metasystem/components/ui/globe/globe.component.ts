import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export type GlobeType = 'alert' | 'warning' | 'danger' | 'message' | 'info';

@Component({
  selector: 'globe',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="containerClasses()">
      <div [class]="textClasses()">
        <icon [icon]="currentIcon()" class="w-5 h-5 flex-shrink-0 mt-0.5"></icon>
        <div class="flex flex-col gap-0.5">
          @if (title()) {
            <span class="font-bold">{{ title() }}</span>
          }
          @if (subtitle()) {
            <span>{{ subtitle() }}</span>
          }
          <ng-content></ng-content>
        </div>
      </div>
      @if (showButton()) {
        <button 
          (click)="buttonClicked.emit()"
          [class]="buttonClasses()"
        >
          {{ buttonText() }}
        </button>
      }
      <ng-content select="[actions]"></ng-content>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class GlobeComponent {
  type = input<GlobeType>('message');
  customIcon = input<string | null>(null);
  title = input<string>();
  subtitle = input<string>();
  showButton = input<boolean>(false);
  buttonText = input<string>('Acción');
  buttonClicked = output<void>();

  currentIcon = computed(() => {
    if (this.customIcon()) return this.customIcon()!;
    switch (this.type()) {
      case 'alert': return 'WarningTriangle'; 
      case 'warning': return 'WarningTriangle';
      case 'danger': return 'XClose'; 
      case 'message': return 'InfoCircle'; 
      case 'info': return 'InfoCircle';
      default: return 'InfoCircle';
    }
  });

  containerClasses = computed(() => {
    const base = "p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 border";
    switch (this.type()) {
      case 'alert':
        return `${base} bg-orange-100 dark:bg-orange-500/15 border-orange-400 dark:border-orange-500/30`;
      case 'warning':
        return `${base} bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10`;
      case 'danger':
        return `${base} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50`;
      case 'message':
        return `${base} bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900`;
      case 'info':
        return `${base} bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20`;
      default:
        return base;
    }
  });

  textClasses = computed(() => {
    const base = "flex gap-2 items-start text-xs";
    switch (this.type()) {
      case 'alert':
        return `${base} text-orange-800 dark:text-orange-300`;
      case 'warning':
        return `${base} text-amber-600 dark:text-amber-400/90`;
      case 'danger':
        return `${base} text-red-700 dark:text-red-400`;
      case 'message':
        return `${base} text-emerald-850 dark:text-emerald-400`;
      case 'info':
        return `${base} text-indigo-850 dark:text-indigo-400`;
      default:
        return base;
    }
  });

  buttonClasses = computed(() => {
    const base = "px-4 py-2 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-theme-xs flex-shrink-0";
    switch (this.type()) {
      case 'alert':
        return `${base} bg-orange-500 hover:bg-orange-600 text-white`;
      case 'warning':
        return `${base} border border-amber-500/30 text-amber-700 dark:text-amber-450 hover:bg-amber-500/10`;
      case 'danger':
        return `${base} bg-red-600 hover:bg-red-700 text-white`;
      case 'message':
        return `${base} border border-emerald-500/30 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-500/10`;
      case 'info':
        return `${base} border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10`;
      default:
        return base;
    }
  });
}
