import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'meta-data-doc',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './meta-data-doc.component.html',
})
export class MetaDataDocComponent {
  @Input() doc: any | null = null;
}
