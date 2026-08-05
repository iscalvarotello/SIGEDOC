import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@interfaces/dynamic-form.interface';
import { DynamicErrorBubbleComponent } from './dynamic-error-bubble.component';

@Component({
  selector: 'app-dynamic-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicErrorBubbleComponent],
  template: `
    <div [ngClass]="{'pointer-events-none opacity-60': isReadonly()}">
      <div class="flex flex-wrap gap-5 mt-3">
        @for (opt of field().options; track opt.value) {
          <div class="flex items-center gap-2">
            <input 
              type="radio" 
              [id]="uniqueId + '-' + opt.value"
              [formControl]="control()" 
              [value]="opt.value" 
              name="{{ field().key + '-' + uniqueId }}"
              class="w-5 h-5 text-theme-primary border-gray-300 focus:ring-theme-primary dark:border-gray-600 dark:bg-gray-800 transition-colors cursor-pointer"
            >
            <label [for]="uniqueId + '-' + opt.value" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-theme-primary dark:hover:text-theme-secondary transition-colors cursor-pointer">
              {{ opt.label }}
            </label>
          </div>
        }
      </div>
      <app-dynamic-error-bubble [control]="control()"></app-dynamic-error-bubble>
    </div>
  `
})
export class DynamicRadioComponent {
  control = input.required<FormControl>();
  field = input.required<FormFieldConfig>();
  isReadonly = input<boolean>(false);
  
  uniqueId = Math.random().toString(36).substring(2, 9);
}
