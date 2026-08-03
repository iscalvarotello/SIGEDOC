import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LIST_BULLETS, ListBulletKey } from '@metasystem/maps/app.bullet.map';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="wrapperClasses">
      @if (type === 'ordered') {
        <ol class="flex flex-col gap-2" [ngClass]="listColorClass">
          @for (item of items; track $index) {
            <li class="flex items-start gap-2">
              <span class="mt-0.5 shrink-0" [ngClass]="bulletColorClass">{{ $index + 1 }}.</span>
              <div class="flex-1 min-w-0">
                <ng-container *ngTemplateOutlet="itemTemplate || defaultTemplate; context: { $implicit: item, index: $index }"></ng-container>
              </div>
            </li>
          }
        </ol>
      } @else {
        <ul class="flex flex-col gap-2" [ngClass]="listColorClass">
          @for (item of items; track $index) {
            <li class="flex items-start gap-2">
              <span class="mt-0.5 shrink-0" [ngClass]="bulletColorClass">{{ bulletChar }}</span>
              <div class="flex-1 min-w-0">
                <ng-container *ngTemplateOutlet="itemTemplate || defaultTemplate; context: { $implicit: item, index: $index }"></ng-container>
              </div>
            </li>
          }
        </ul>
      }

      <ng-template #defaultTemplate let-item>
        <span>{{ item }}</span>
      </ng-template>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() type: 'ordered' | 'unordered' = 'unordered';
  
  // Bullets
  @Input() bulletKey: ListBulletKey = 'dot';
  @Input() bulletColorClass: string = 'text-gray-500';
  @Input() listColorClass: string = 'text-xs text-gray-600 dark:text-gray-300';
  
  // Box styling
  @Input() boxed: boolean = false;
  @Input() boxClass: string = 'bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-800'; // Default box styling

  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  get bulletChar(): string {
    return LIST_BULLETS[this.bulletKey] || LIST_BULLETS['dot'];
  }

  get wrapperClasses(): string {
    if (this.boxed) {
      return `my-2 ${this.boxClass}`;
    }
    return 'my-2'; // Default margin even if not boxed
  }
}
