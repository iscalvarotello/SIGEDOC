import { Component, OnInit, inject, signal, effect, input, output, model, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { EditorInjectionStrategy } from '@system-shared/form/editor-injection.strategy';
import { TinymceEditorComponent } from '@system-shared/form/tinymce-editor/tinymce-editor.component';
import { DynamicFieldsPanelComponent } from '../dynamic-fields-panel/dynamic-fields-panel.component';

@Component({
  selector: 'app-document-editor-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TinymceEditorComponent, DynamicFieldsPanelComponent
  ],
  templateUrl: './document-editor-panel.component.html'
})
export class DocumentEditorPanelComponent implements OnInit {
  @ViewChild(EditorInjectionStrategy) editorStrategy?: EditorInjectionStrategy;

  // Inputs & Outputs
  cuerpo = model.required<string>();
  initialDictionary = input<Record<string, string>>({});
  
  activeAreaCustomFields = input<string[]>([]);
  personalFieldValues = model<Record<string, string>>({});
  
  onAddCustomField = output<string>();
  dictionaryChange = output<Record<string, string>>();

  // Internal state
  internalCuerpo = signal<string>('');
  localDictionary = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      const html = this.internalCuerpo();
      this.cuerpo.set(html);
    }, { allowSignalWrites: true });
    
    effect(() => {
      if (this.cuerpo() !== this.internalCuerpo()) {
        this.internalCuerpo.set(this.cuerpo());
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
  }

  onDictionaryChange(dict: Record<string, string>) {
    this.localDictionary.set(dict);
    this.dictionaryChange.emit(dict);
  }

  handleInjectTag(tag: string) {
    if (tag === '__REPLACE_ALL_TAGS__') {
      this.replaceTagsInBody();
      return;
    }

    if (this.editorStrategy) {
      this.editorStrategy.insertTextAtCursor(tag);
    } else {
      // Fallback
      this.internalCuerpo.set(this.internalCuerpo() + ' ' + tag);
    }
  }

  replaceTagsInBody() {
    let content = this.internalCuerpo();
    if (!content) return;
    const dict = this.localDictionary();
    for (const [key, value] of Object.entries(dict)) {
      if (value !== '') {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      }
    }
    this.internalCuerpo.set(content);
  }
}
