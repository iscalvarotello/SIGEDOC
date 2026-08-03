import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '@system-shared/form/date-picker/date-picker.component';

@Component({
  selector: 'doc-search-filter',
  standalone: true,
  imports: [ActionButtonComponent, CommonModule, FormsModule, DatePickerComponent, IconComponent],
  templateUrl: './doc-search-filter.component.html',
})
export class DocSearchFilterComponent {
  @Input() searchQuery: string = '';
  @Input() startDateInput: string = '';
  @Input() endDateInput: string = '';
  @Input() appliedStartDate: string = '';
  @Input() appliedEndDate: string = '';
  @Input() year: number = new Date().getFullYear();

  @Output() searchQueryChange    = new EventEmitter<string> ( ) ;
  @Output() startDateInputChange = new EventEmitter<string> ( ) ;
  @Output() endDateInputChange   = new EventEmitter<string> ( ) ;
  @Output() yearChange           = new EventEmitter<number> ( ) ;

  @Output() inputSearch          = new EventEmitter<void>   ( ) ;
  @Output() applyFilter          = new EventEmitter<void>   ( ) ;
  @Output() clearFilter          = new EventEmitter<void>   ( ) ;
}
