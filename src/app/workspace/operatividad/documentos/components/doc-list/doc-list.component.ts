import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DocCardComponent } from './doc-card.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';

@Component({
  selector: 'doc-list',
  standalone: true,
  imports: [CommonModule, DocCardComponent, TitleComponent],
  templateUrl: './doc-list.component.html',
})
export class DocListComponent {
  @Input() documents: any[] = [];
  @Input() selectedDocId: string | null = null;
  @Input() isLoading: boolean = false;
  @Input() bulkSelectionEnabled: boolean = false;
  @Input() selectedBulkDocIds: string[] = [];

  @Output() selectDocument = new EventEmitter<string>();
  @Output() openPdf = new EventEmitter<{ type: 'draft' | 'final'; doc: any }>();
  @Output() toggleBulkSelection = new EventEmitter<string>();
}
