import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'content-nav-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:p-8 min-h-[500px]">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ContentNavCardComponent {
}
