import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@interfaces/dynamic-form.interface';
import { DynamicErrorBubbleComponent } from './dynamic-error-bubble.component';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicErrorBubbleComponent],
  template: `
    <div class="relative">
      <input 
        [type]="field().type" 
        [formControl]="control()"
        [placeholder]="field().placeholder || ''"
        [readonly]="isReadonly()"
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all"
        [ngClass]="{
          'border-red-300 focus:ring-red-500/50 focus:border-red-500': control().invalid && (control().touched || control().hasError('serverError')),
          'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed': isReadonly()
        }"
      >
      <app-dynamic-error-bubble [control]="control()"></app-dynamic-error-bubble>
    </div>
  `
})
export class DynamicInputComponent {
  control = input.required<FormControl>();
  field = input.required<FormFieldConfig>();
  isReadonly = input<boolean>(false);
}
