import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'preview-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label) {
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{{ label }}</span>
      }
      <div [ngClass]="minHeightClass" class="w-full rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden flex items-center justify-center relative p-4">
        @if (src) {
          <img [src]="src" class="w-full h-auto max-h-[800px] object-contain rounded-xl shadow-sm" [alt]="altText">
        } @else {
          <div class="flex flex-col items-center justify-center text-center p-6">
            <span class="text-xs font-bold text-gray-450 dark:text-gray-500">{{ fallbackText }}</span>
            @if (fallbackSubText) {
              <span class="text-[9px] text-gray-400 mt-1">{{ fallbackSubText }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class PreviewImageComponent {
  @Input() src: string | null = null;
  @Input() label?: string;
  @Input() fallbackText: string = 'Sin vista previa';
  @Input() fallbackSubText?: string;
  @Input() altText: string = 'Vista previa de imagen';
  @Input() minHeightClass: string = 'min-h-[450px] md:min-h-[600px]';

  // Opcionalmente pasar la URL relativa del servidor y armarla automáticamente
  @Input() set server_img(val: string | null | undefined) {
    if (val) {
      const cleanPath = val.startsWith('/') ? val.substring(1) : val;
      if (val.startsWith('http')) {
        this.src = val;
      } else {
        const baseUrl = environment.URL_PATH.replace(/\/$/, '');
        this.src = `${baseUrl}/${cleanPath}`;
      }
    } else {
      this.src = null;
    }
  }
}
