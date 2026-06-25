import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'doc-history-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doc-history-links.component.html',
})
export class DocHistoryLinksComponent {
  @Input() doc: any | null = null;
}
