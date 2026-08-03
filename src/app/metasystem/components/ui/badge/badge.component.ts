import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-badge',
  imports: [CommonModule,SafeHtmlPipe],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'light';
  @Input() size: BadgeSize = 'md';
  @Input() color: BadgeColor = 'primary';
  @Input() startIcon?: string; // SVG or HTML string
  @Input() endIcon?: string;   // SVG or HTML string

  @HostBinding('class') get hostClasses(): string {
    // return `${this.baseStyles} ${this.sizeClass} ${this.colorStyles}`;
    return `flex`;
  }

  get baseStyles() {
    return 'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium';
  }

  get sizeClass() {
    return {
      sm: 'text-theme-xs',
      md: 'text-sm',
    }[this.size];
  }

  get colorStyles() {
    const variants = {
      light: {
        primary: 'bg-theme-primary/10 text-theme-primary dark:bg-theme-primary/15 dark:text-white',
        secondary: 'bg-theme-secondary/15 text-theme-secondary dark:bg-theme-secondary/20 dark:text-theme-secondary',
        success: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        error: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
        info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
        light: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
        dark: 'bg-gray-500 text-white dark:bg-gray-700 dark:text-white',
      },
      solid: {
        primary: 'bg-theme-primary text-white dark:text-white',
        secondary: 'bg-theme-secondary text-white dark:text-white',
        success: 'bg-green-500 text-white dark:text-white',
        error: 'bg-red-500 text-white dark:text-white',
        warning: 'bg-amber-500 text-white dark:text-white',
        info: 'bg-blue-500 text-white dark:text-white',
        light: 'bg-gray-400 dark:bg-gray-700 text-white dark:text-gray-200',
        dark: 'bg-gray-700 text-white dark:text-white',
      },
    };
    return variants[this.variant][this.color];
  }
}