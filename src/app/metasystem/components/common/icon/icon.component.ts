import { Component, input, effect, ElementRef, inject, computed } from '@angular/core';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { extractFileExtension } from '@utils/file.utils';

@Component({
  selector: 'icon',
  standalone: true,
  template: ``,
  host: {
    'class': 'inline-flex items-center justify-center shrink-0 transition-transform duration-200',
    '[class.rotate-180]': 'rotate()',
    // Variantes de color predefinidas
    '[class.text-gray-500]': 'variant() === "muted"',
    '[class.dark:text-gray-400]': 'variant() === "muted"',
    '[class.text-brand-500]': 'variant() === "brand"',
    '[class.text-red-500]': 'variant() === "danger"',
    '[class.text-emerald-500]': 'variant() === "success"',
    '[class.text-amber-500]': 'variant() === "warning"',
  }
})
export class IconComponent {
  icon = input.required<keyof typeof SVG_ICONS | string>();
  type = input<'svg' | 'png'>('svg');
  rotate = input<boolean>(false);
  variant = input<'default' | 'muted' | 'brand' | 'danger' | 'success' | 'warning'>('default');
  
  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      if (this.type() === 'png') {
        const iconName = this.icon() as string;
        const ext = this.getFileExtension(iconName);
        const src = this.getAttachmentIconPath(ext);
        this.el.nativeElement.innerHTML = `<img src="${src}" alt="${ext}" class="w-full h-full object-contain" />`;
      } else {
        const iconName = this.icon() as keyof typeof SVG_ICONS;
        const svgString = SVG_ICONS[iconName] || '';
        if (!svgString) {
          console.warn(`Icon '${String(iconName)}' not found in SVG_ICONS`);
        }
        this.el.nativeElement.innerHTML = svgString;
      }
    });
  }

  private getFileExtension(filename: string): string {
    const ext = extractFileExtension(filename);
    return ext ? ext : 'pdf';
  }

  private getAttachmentIconPath(ext: string): string {
    switch (ext.toLowerCase()) {
      case 'pdf': return '/images/png-icons/pdf.png';
      case 'docx':
      case 'doc': return '/images/png-icons/doc.png';
      case 'xlsx':
      case 'xls': return '/images/png-icons/xls.png';
      case 'pptx':
      case 'ppt': return '/images/png-icons/ppt.png';
      case 'png': return '/images/png-icons/png.png';
      case 'jpg': return '/images/png-icons/jpg.png';
      case 'jpeg': return '/images/png-icons/jpeg.png';
      case 'gif': return '/images/png-icons/gif.png';
      case 'tiff': return '/images/png-icons/tiff.png';
      case 'zip': return '/images/png-icons/zip.png';
      case 'rar': return '/images/png-icons/rar.png';
      default: return '/images/png-icons/pdf.png';
    }
  }
}