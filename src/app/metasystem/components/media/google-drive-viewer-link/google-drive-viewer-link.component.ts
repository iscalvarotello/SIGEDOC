import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-google-drive-viewer-link',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (displayMode() === 'button') {
      <a 
        [href]="url()" 
        target="_blank"
        class="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer">
        {{ label() }}
      </a>
    } @else {
      <a 
        [href]="url()" 
        target="_blank"
        class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
        {{ label() }}
        <icon icon="ExternalLink" class="w-3.5 h-3.5"></icon>
      </a>
    }
  `
})
export class GoogleDriveViewerLinkComponent {
  url = input.required<string>();
  label = input<string>('Google Drive');
  displayMode = input<'button' | 'link'>('button');
}
