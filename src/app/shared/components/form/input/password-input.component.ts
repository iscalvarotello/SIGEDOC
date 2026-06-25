import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVG_ICONS } from '../../../icons/svg-icons';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="relative">
        <input
          [type]="showPassword ? 'text' : 'password'"
          [id]="id"
          [name]="name"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [autocomplete]="autocomplete"
          [required]="required"
          [ngClass]="inputClasses"
          (input)="onInput($event)"
        />
        <span
          (click)="togglePasswordVisibility()"
          class="absolute z-30 cursor-pointer right-4 top-1/2 -translate-y-1/2 select-none flex items-center justify-center text-gray-500 hover:text-gray-750 dark:text-gray-400 dark:hover:text-gray-200 size-5"
        >
          @if (showPassword) {
            <span class="size-5 flex items-center justify-center" [innerHTML]="eyeOpenIcon()"></span>
          } @else {
            <span class="size-5 flex items-center justify-center" [innerHTML]="eyeClosedIcon()"></span>
          }
        </span>
      </div>
      
      @if (hint) {
      <p class="mt-1.5 text-xs"
        [ngClass]="{
          'text-error-500': error,
          'text-success-500': success,
          'text-gray-500': !error && !success
        }">
        {{ hint }}
      </p>
      }
    </div>
  `
})
export class PasswordInputComponent {
  @Input() id?: string = '';
  @Input() name: string = 'password';
  @Input() placeholder: string = 'Ingrese su contraseña';
  @Input() value: string = '';
  @Input() autocomplete: string = 'current-password';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() hint?: string;

  @Output() valueChange = new EventEmitter<string>();

  showPassword = false;
  
  private sanitizer = inject(DomSanitizer);

  eyeOpenIcon = computed<SafeHtml>(() => {
    return this.sanitizer.bypassSecurityTrustHtml(SVG_ICONS.OjoAbierto);
  });

  eyeClosedIcon = computed<SafeHtml>(() => {
    return this.sanitizer.bypassSecurityTrustHtml(SVG_ICONS.OjoTachado);
  });

  get inputClasses(): string {
    let classes = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 pr-12 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;

    if (this.disabled) {
      classes += ` text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
    } else if (this.error) {
      classes += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (this.success) {
      classes += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
      classes += ` bg-transparent text-gray-800 border-gray-300 focus:border-[#691C32] focus:ring-[#691C32]/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-[#BC955C] dark:focus:ring-[#BC955C]/20`;
    }
    return classes;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
