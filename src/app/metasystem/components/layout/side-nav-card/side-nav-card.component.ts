import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'side-nav-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-2 h-full">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class SideNavCardComponent {
}
