import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '@shared/components/form/date-picker/date-picker.component';

@Component({
  selector: 'doc-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './doc-search-filter.component.html',
})
export class DocSearchFilterComponent {
  @Input() searchQuery: string = '';
  @Input() startDateInput: string = '';
  @Input() endDateInput: string = '';
  @Input() appliedStartDate: string = '';
  @Input() appliedEndDate: string = '';

  @Output() searchQueryChange    = new EventEmitter<string> ( ) ;
  @Output() startDateInputChange = new EventEmitter<string> ( ) ;
  @Output() endDateInputChange   = new EventEmitter<string> ( ) ;

  @Output() inputSearch          = new EventEmitter<void>   ( ) ;
  @Output() applyFilter          = new EventEmitter<void>   ( ) ;
  @Output() clearFilter          = new EventEmitter<void>   ( ) ;
}
