import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

type TagCategory = 'proyecto' | 'proveedor' | 'vehiculo' | 'evento' | 'general' | 'personalizados';

@Component({
  selector: 'app-template-tags-panel',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, IconComponent],
  templateUrl: './template-tags-panel.component.html'
})
export class TemplateTagsPanelComponent {
  @Output() tagSelected = new EventEmitter<string>();

  activeFieldsTab = signal<TagCategory>('proyecto');

  insertTag(tag: string) {
    this.tagSelected.emit(tag);
  }
}
