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
          <label class="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              [formControl]="control()" 
              [value]="opt.value" 
              class="w-5 h-5 text-theme-primary border-gray-300 focus:ring-theme-primary dark:border-gray-600 dark:bg-gray-800 transition-colors"
            >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-theme-primary dark:group-hover:text-theme-secondary transition-colors">{{ opt.label }}</span>
          </label>
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
}
