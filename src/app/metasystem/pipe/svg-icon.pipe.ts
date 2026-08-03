import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { extractFileExtension } from '@utils/file.utils';

@Pipe({
  name: 'svgIcon',
  standalone: true
})
export class SvgIconPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(iconName: string, type: 'icon' | 'png' = 'icon'): SafeHtml {
    if (type === 'png') {
      const ext = this.getFileExtension(iconName);
      const src = this.getAttachmentIconPath(ext);
      // Return a safe img tag
      return this.sanitizer.bypassSecurityTrustHtml(`<img src="${src}" alt="${ext}" class="w-full h-full object-contain" />`);
    }

    const svgString = (SVG_ICONS as any)[iconName] || '';
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  private getFileExtension(filename: string): string {
    const ext = extractFileExtension(filename);
    return ext ? ext : 'pdf'; // Default fallback
  }

  private getAttachmentIconPath(ext: string): string {
    switch (ext) {
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
      default: return '/images/png-icons/pdf.png'; // <--- Cambiado de doc.png a pdf.png
    }
  }
}
