import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartImageComponent, ForceTheme } from '../smart-image/smart-image.component';

@Component({
  selector: 'escudo',
  standalone: true,
  imports: [CommonModule, SmartImageComponent],
  template: `
    <smart-image 
      name="escudo"
      [forceTheme]="forceTheme()"
      [width]="width()"
      [height]="height()"
      [imgClass]="imgClass()"
      [marco]="marco()"
      [css_marco]="css_marco()">
    </smart-image>
  `,
  host: {
    'class': 'inline-flex items-center justify-center shrink-0'
  }
})
export class EscudoComponent {
  forceTheme = input<ForceTheme>('auto');
  width = input<number | string | undefined>(500);
  height = input<number | string | undefined>('auto');
  imgClass = input<string>('');
  marco = input<boolean>(true);
  css_marco = input<string>('p-8 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-black/50');
}
