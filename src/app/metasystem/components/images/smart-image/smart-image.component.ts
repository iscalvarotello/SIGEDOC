import { Component, input, computed, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '@services/theme.service';
import { ImageDictionary } from '@metasystem/maps/app.image.map';

export type ImageShape = 'square' | 'circle' | 'oval' | 'square-rounded';
export type ForceTheme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'smart-image',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class]': 'hostClasses()',
    '[style.width]': 'computedWidth()',
    '[style.height]': 'computedHeight()'
  },
  template: `
    <img 
      [src]="resolvedSrc()" 
      [alt]="alt()" 
      [class]="imageClasses()" 
      (error)="imgError.emit($event)" />
  `
})
export class SmartImageComponent {
  name = input<string>();
  src = input<string>();
  alt = input<string>('system');
  
  shape = input<ImageShape>('square');
  forceTheme = input<ForceTheme>('auto');
  
  width = input<number | string | undefined>(undefined);
  height = input<number | string | undefined>(undefined);
  
  imgClass = input<string>('');
  
  marco = input<boolean>(false);
  css_marco = input<string>('p-4 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-black/50');

  @Output() imgError = new EventEmitter<Event>();

  private themeService = inject(ThemeService);
  private currentTheme = toSignal(this.themeService.theme$, { initialValue: 'light' });

  resolvedSrc = computed(() => {
    if (this.src()) return this.src();
    const n = this.name(); 
    if (n && ImageDictionary[n]) {
      const def = ImageDictionary[n];
      const activeTheme = this.forceTheme() !== 'auto' ? this.forceTheme() : this.currentTheme();
      if (activeTheme === 'dark' && def.dark) return def.dark;
      return def.light;
    }
    return '';
  });

  hostClasses = computed(() => {
    let classes = 'flex w-full h-full items-center justify-center shrink-0 leading-none ';
    if (this.marco()) {
      classes += this.css_marco() + ' ';
    }
    return classes.trim();
  });

  imageClasses = computed(() => {
    let classes = 'w-full h-full transition-all duration-300 ';
    if (!this.imgClass() || !this.imgClass().includes('object-')) {
      classes += 'object-contain ';
    }
    switch (this.shape()) {
      case 'circle': classes += 'rounded-full '; break;
      case 'square-rounded': classes += 'rounded-xl '; break;
      case 'oval': classes += 'rounded-[50%] '; break;
      case 'square': default: classes += 'rounded-none '; break;
    }
    if (this.imgClass()) classes += this.imgClass();
    return classes.trim();
  });

  computedWidth = computed(() => {
    const w = this.width();
    if (w === null || w === undefined) return null;
    if (w === 'auto') return 'auto';
    return isNaN(Number(w)) ? w : `${w}px`;
  });

  computedHeight = computed(() => {
    const h = this.height();
    if (h === null || h === undefined) return null;
    if (h === 'auto') return 'auto';
    return isNaN(Number(h)) ? h : `${h}px`;
  });
}
