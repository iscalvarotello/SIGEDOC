import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, IconComponent],
  template: `
  <label
  class="flex items-center space-x-3 group cursor-pointer"
  [ngClass]="{ 'cursor-not-allowed opacity-60': disabled }"
>
  <div class="relative w-5 h-5">
    <input
      [id]="id"
      type="checkbox"
      class="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
      [ngClass]="className"
      [checked]="checked"
      (change)="onChange($event)"
      [disabled]="disabled"
    />
    @if (checked) {
    <ng-container>
      <icon icon="Checkmark" class="w-3.5 h-3.5 absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 text-white"></icon>
    </ng-container>
    }
    @if (disabled) {
    <ng-container>
      <icon icon="Checkmark" class="w-3.5 h-3.5 absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 text-[#E4E7EC]"></icon>
    </ng-container>
    }
  </div>
  @if (label) {
  <span
    class="text-sm font-medium text-gray-800 dark:text-gray-200"
    >
      {{ label }}
  </span>
  }
</label>
  `,
  styles: ``
})
export class CheckboxComponent {

  @Input() label?: string;
  @Input() checked = false;
  @Input() className = '';
  @Input() id?: string;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
