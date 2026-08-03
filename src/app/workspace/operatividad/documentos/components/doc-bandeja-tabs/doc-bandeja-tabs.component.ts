import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';

import { CommonModule } from '@angular/common';
import { TitleComponent } from '@system-shared/ui/title/title.component';

export interface BandejaItem {
  name: string;
  count: number;
}

@Component({
  selector: 'doc-bandeja-tabs',
  standalone: true,
  imports: [CommonModule, TitleComponent, ActionButtonComponent],
  templateUrl: './doc-bandeja-tabs.component.html',
})
export class DocBandejasTabsComponent {
  @Input() bandejas: BandejaItem[] = [];
  @Input() selectedBandeja: string | null = null;
  @Input() isLoading: boolean = false;

  @Output() bandejaChange = new EventEmitter<string>();
}