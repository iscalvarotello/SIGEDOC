import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@interfaces/dynamic-form.interface';
import { DynamicErrorBubbleComponent } from './dynamic-error-bubble.component';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicErrorBubbleComponent],
  template: `
    <div class="relative" [ngClass]="{'pointer-events-none opacity-60': isReadonly()}">
      <select 
        [formControl]="control()"
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all appearance-none"
        [ngClass]="{'border-red-300 focus:ring-red-500/50 focus:border-red-500': control().invalid && (control().touched || control().hasError('serverError'))}">
        <option value="" disabled selected>{{ field().placeholder || 'Seleccione una opción...' }}</option>
        @for (opt of field().options; track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
      <div class="absolute top-3 right-3 flex items-center pointer-events-none text-gray-400">
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <app-dynamic-error-bubble [control]="control()"></app-dynamic-error-bubble>
    </div>
  `
})
export class DynamicSelectComponent {
  control = input.required<FormControl>();
  field = input.required<FormFieldConfig>();
  isReadonly = input<boolean>(false);
}
