import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocCardComponent } from './doc-card.component';

@Component({
  selector: 'doc-list',
  standalone: true,
  imports: [CommonModule, DocCardComponent],
  templateUrl: './doc-list.component.html',
})
export class DocListComponent {
  @Input() documents: any[] = [];
  @Input() selectedDocId: string | null = null;
  @Input() isLoading: boolean = false;

  @Output() selectDocument = new EventEmitter<string>();
  @Output() openPdf = new EventEmitter<{ type: 'draft' | 'final'; doc: any }>();
}
