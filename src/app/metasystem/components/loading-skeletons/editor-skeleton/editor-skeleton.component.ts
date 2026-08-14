import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editor-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse flex flex-col border border-gray-200 rounded-md overflow-hidden" [style.min-height]="minHeight">
      <!-- Toolbar Skeleton -->
      <div class="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-3 space-x-2">
        <div class="h-6 w-24 bg-gray-200 rounded"></div>
        <div class="h-6 w-12 bg-gray-200 rounded"></div>
        <div class="h-4 w-px bg-gray-300 mx-2"></div>
        <div class="h-6 w-8 bg-gray-200 rounded"></div>
        <div class="h-6 w-8 bg-gray-200 rounded"></div>
        <div class="h-6 w-8 bg-gray-200 rounded"></div>
      </div>
      <!-- Body Skeleton -->
      <div class="flex-1 bg-white p-4 space-y-4">
        <div class="h-4 bg-gray-100 rounded w-3/4"></div>
        <div class="h-4 bg-gray-100 rounded w-full"></div>
        <div class="h-4 bg-gray-100 rounded w-5/6"></div>
        <div class="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
      <!-- Statusbar Skeleton -->
      <div class="h-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end px-3">
        <div class="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  `
})
export class EditorSkeletonComponent {
  @Input() minHeight = '300px';
}
