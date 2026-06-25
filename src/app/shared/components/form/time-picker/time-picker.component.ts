
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-time-picker',
  imports: [],
  templateUrl: './time-picker.component.html',
  styles: ``
})
export class TimePickerComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() id!: string;
  @Input() label: string = 'Time Select Input';
  @Input() placeholder: string = 'Select time';
  @Input() defaultTime?: string | Date;
  @Input() disabled: boolean = false;

  @Output() timeChange = new EventEmitter<string>();

  @ViewChild('timeInput', { static: false }) timeInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.timeInput.nativeElement, {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',   // time format HH:mm (24hr)
      time_24hr: true,     // set true for 24hr clock
      minuteIncrement: 1,
      defaultDate: this.defaultTime || undefined,
      onChange: (selectedDates, dateStr) => {
        this.timeChange.emit(dateStr); // emit "HH:mm"
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultTime'] && this.flatpickrInstance) {
      const newVal = changes['defaultTime'].currentValue;
      this.flatpickrInstance.setDate(newVal || '', false);
    }
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
