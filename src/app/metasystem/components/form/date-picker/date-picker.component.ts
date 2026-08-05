import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { LabelComponent } from '../label/label.component';
import "flatpickr/dist/flatpickr.css";

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [LabelComponent, NgClass],
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  styles: ``
})
export class DatePickerComponent implements ControlValueAccessor {

  @Input() id!: string;
  @Input() mode: 'single' | 'multiple' | 'range' | 'time' = 'single';
  @Input() defaultDate?: string | Date | string[] | Date[];
  @Input() label?: string;
  @Input() prefixLabel?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' = 'md';
  @Input() enableTime = false;
  @Output() dateChange = new EventEmitter<any>();

  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;
  private value: any = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      mode: this.mode,
      static: false,
      monthSelectorType: 'static',
      enableTime: this.enableTime,
      dateFormat: this.enableTime ? 'Y-m-d\\TH:i' : 'Y-m-d',
      defaultDate: this.value || this.defaultDate,
      locale: Spanish,
      onChange: (selectedDates, dateStr, instance) => {
        this.value = dateStr;
        this.onChange(dateStr);
        this.onTouched();
        this.dateChange.emit({ selectedDates, dateStr, instance });
      }
    });

    if (this.disabled && this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.dateInput.nativeElement.disabled = true;
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.value, false);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.flatpickrInstance) {
      if (isDisabled) {
        this.flatpickrInstance.destroy();
        this.dateInput.nativeElement.disabled = true;
      } else {
        this.ngAfterViewInit(); // Re-initialize flatpickr
      }
    }
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
