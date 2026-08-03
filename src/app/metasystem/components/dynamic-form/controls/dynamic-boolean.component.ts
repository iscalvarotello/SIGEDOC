import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@interfaces/dynamic-form.interface';
import { DynamicErrorBubbleComponent } from './dynamic-error-bubble.component';

@Component({
  selector: 'app-dynamic-boolean',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicErrorBubbleComponent],
  template: `
    <div [ngClass]="{'pointer-events-none opacity-60': isReadonly()}">
      <label class="relative inline-flex items-center cursor-pointer mt-2">
        <input type="checkbox" [formControl]="control()" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-theme-primary/50 dark:peer-focus:ring-theme-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-theme-primary"></div>
        <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{{ field().placeholder || (control().value ? 'Activado' : 'Desactivado') }}</span>
      </label>
      <app-dynamic-error-bubble [control]="control()"></app-dynamic-error-bubble>
    </div>
  `
})
export class DynamicBooleanComponent {
  control = input.required<FormControl>();
  field = input.required<FormFieldConfig>();
  isReadonly = input<boolean>(false);
}
