import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BandejaItem {
  name: string;
  count: number;
}

@Component({
  selector: 'doc-bandeja-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doc-bandeja-tabs.component.html',
})
export class DocBandejasTabsComponent {
  @Input() bandejas: BandejaItem[] = [];
  @Input() selectedBandeja: string | null = null;
  @Input() isLoading: boolean = false;

  @Output() bandejaChange = new EventEmitter<string>();
}