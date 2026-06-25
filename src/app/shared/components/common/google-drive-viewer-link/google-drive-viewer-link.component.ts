import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-drive-viewer-link',
  standalone: true,
  imports: [CommonModule],
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
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    }
  `
})
export class GoogleDriveViewerLinkComponent {
  url = input.required<string>();
  label = input<string>('Google Drive');
  displayMode = input<'button' | 'link'>('button');
}
