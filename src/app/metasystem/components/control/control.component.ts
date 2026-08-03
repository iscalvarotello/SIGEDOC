import { Component, Input, Optional, Self, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, FormsModule, ReactiveFormsModule, ControlValueAccessor } from '@angular/forms';

export type ControlType = 'text' | 'number' | 'password' | 'textarea' | 'email';

@Component({
  selector: 'control',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './control.component.html',
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ControlComponent implements ControlValueAccessor {
  @Input() type: ControlType = 'text';
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() step?: number;
  
  showPassword = signal<boolean>(false);

  value: any = '';
  isDisabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(val: any): void {
    this.value = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  get isInvalidAndTouched(): boolean {
    if (!this.ngControl) return false;
    const ctrl = this.ngControl.control;
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalidAndTouched) return null;
    
    const errors = this.ngControl?.control?.errors;
    if (!errors) return null;

    if (errors['required']) return 'Este campo es obligatorio.';
    if (errors['email']) return 'El formato del correo es inválido.';
    if (errors['minlength']) return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `No debe exceder ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}.`;
    if (errors['max']) return `El valor máximo es ${errors['max'].max}.`;
    if (errors['pattern']) return 'El formato ingresado no es válido.';
    if (errors['serverError']) return errors['serverError'];
    
    return 'El campo contiene un error.';
  }

  get baseClasses(): string {
    let classes = 'w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border text-sm rounded-lg font-semibold transition-colors focus:outline-none ';
    
    if (this.isDisabled) {
      classes += 'border-gray-200 dark:border-gray-700 text-gray-400 opacity-60 cursor-not-allowed ';
    } else if (this.isInvalidAndTouched) {
      classes += 'border-red-400 dark:border-red-500/50 text-red-600 dark:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ';
    } else {
      classes += 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:border-theme-primary focus:ring-1 focus:ring-theme-primary ';
    }
    
    return classes;
  }
}
