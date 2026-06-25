import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'doc-actions-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doc-actions-toolbar.component.html',
})
export class DocActionsToolbarComponent {
  @Input() doc: any | null = null;
  @Input() isActionLoading = false;

  @Output() showForm = new EventEmitter<string>();
  @Output() submitAction = new EventEmitter<string>();
  @Output() reply = new EventEmitter<void>();
  @Output() followUp = new EventEmitter<void>();
  @Output() makeFollowUp = new EventEmitter<void>();
}
