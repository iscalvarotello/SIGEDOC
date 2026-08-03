import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export type TitleType = 'primary' | 'secondary' | 'third' | 'four' | 'five';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [ngClass]="containerClasses">
      @if (icon) {
        <icon [icon]="icon" [ngClass]="iconSizeClasses"></icon>
      }
      <div class="flex flex-col" [ngClass]="textContainerClasses">
        @if (reverseOrder && subtitle) {
          <p [ngClass]="computedSubtitleClasses">{{ subtitle }}</p>
        }
        <h4 [ngClass]="computedTitleClasses">{{ title }}</h4>
        @if (!reverseOrder && subtitle) {
          <p [ngClass]="computedSubtitleClasses">{{ subtitle }}</p>
        }
      </div>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class TitleComponent {
  @Input() type: TitleType = 'primary';
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() customColorClass?: string;
  @Input() align: 'left' | 'center' = 'left';
  @Input() extraSubtitleClasses?: string;
  @Input() iconSize?: 'xl' | 'lg' | 'md' | 'sm';
  @Input() reverseOrder: boolean = false;
  
  get containerClasses(): string {
    const layout = this.align === 'center' ? 'flex-col items-center justify-center gap-2' : 'flex-row items-center gap-3';
    const color = this.customColorClass ? this.customColorClass : '';
    return `flex ${layout} ${color}`.trim();
  }

  get textContainerClasses(): string {
    let classes = this.align === 'center' ? 'items-center text-center' : 'justify-center';
    const gap = this.type === 'primary' ? 'gap-1' : 'gap-0.5';
    return `${classes} ${gap}`.trim();
  }

  get computedTitleClasses(): string {
    let base = '';
    switch (this.type) {
      case 'primary':
        base = 'text-2xl font-bold';
        break;
      case 'secondary':
        base = 'text-lg font-bold';
        break;
      case 'third':
        base = 'text-sm font-bold';
        break;
      case 'four':
        base = 'text-xs font-bold uppercase tracking-wide';
        break;
      case 'five':
        base = 'text-xs font-semibold';
        break;
      default:
        base = 'text-lg font-bold';
    }

    if (this.customColorClass) {
      return base;
    }

    switch (this.type) {
      case 'primary':
        return `${base} text-gray-900 dark:text-white`;
      case 'secondary':
        return `${base} text-gray-800 dark:text-gray-100`;
      case 'third':
        return `${base} text-gray-800 dark:text-white`;
      case 'four':
        return `${base} text-gray-700 dark:text-gray-200`;
      case 'five':
        return `${base} text-gray-700 dark:text-gray-300`;
      default:
        return `${base} text-gray-800 dark:text-white`;
    }
  }

  get computedSubtitleClasses(): string {
    let base = '';
    switch (this.type) {
      case 'primary':
        base = 'text-sm text-gray-500 dark:text-gray-400';
        break;
      case 'secondary':
        base = 'text-xs text-gray-400';
        break;
      case 'third':
        base = 'text-xs text-gray-400';
        break;
      case 'four':
        base = 'text-[10px] text-gray-400';
        break;
      case 'five':
        base = 'text-[10px] text-gray-400';
        break;
      default:
        base = 'text-xs text-gray-400';
    }
    
    if (this.extraSubtitleClasses) {
      base += ` ${this.extraSubtitleClasses}`;
    }
    
    return base;
  }

  get iconSizeClasses(): string {
    if (this.iconSize) {
      switch (this.iconSize) {
        case 'xl': return 'w-12 h-12';
        case 'lg': return 'w-9 h-9';
        case 'md': return 'w-6 h-6';
        case 'sm': return 'w-4 h-4';
      }
    }

    switch (this.type) {
      case 'primary': return 'w-8 h-8';
      case 'secondary': return 'w-6 h-6';
      case 'third': return 'w-5 h-5';
      case 'four': return 'w-4 h-4';
      default: return 'w-6 h-6';
    }
  }
}
