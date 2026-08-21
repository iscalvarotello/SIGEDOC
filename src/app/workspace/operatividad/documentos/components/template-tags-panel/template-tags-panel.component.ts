import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

type TagCategory = 'proyecto' | 'proveedor' | 'vehiculo' | 'evento' | 'general' | 'personalizados';

@Component({
  selector: 'app-template-tags-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent, IconComponent],
  templateUrl: './template-tags-panel.component.html'
})
export class TemplateTagsPanelComponent {
  @Output() tagSelected = new EventEmitter<string>();

  activeFieldsTab = signal<TagCategory>('proyecto');

  customVariableName = signal<string>('');

  insertCustomVariable() {
    let val = this.customVariableName().trim();
    if (!val) return;
    val = val.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    this.insertTag("{{__" + val + "" + "}}");
    this.customVariableName.set('');
  }

  insertTag(tag: string) {
    this.tagSelected.emit(tag);
  }
}

