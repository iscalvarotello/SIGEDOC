import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './range.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class RangeComponent implements ControlValueAccessor {
  @Input() title?: string;
  @Input() leftLabel?: string;
  @Input() rightLabel?: string;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  
  @Output() changed = new EventEmitter<number>();

  disabled: boolean = false;
  value = signal<number>(0);

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(val: any): void {
    if (val !== undefined && val !== null) {
      this.value.set(Number(val));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.value.set(val);
    this.onChange(val);
    this.onTouch();
  }

  onChangeEvent(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.changed.emit(val);
  }
}
