import { TAG_DICTIONARY } from '@core/constants/tag-dictionary.constant';
﻿import { Component, OnInit, inject, signal, effect, input, output, model, ViewChild } from '@angular/core';
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

    // Lookup in dictionary
    const meta = TAG_DICTIONARY.find(t => t.tag === tag);
    const wrapperType = meta ? meta.wrapperType : 'binding'; // default is binding (span)
    const cleanTag = tag.replace(/[{}]/g, '');
    
    let htmlToInsert = tag; // fallback raw
    
    if (wrapperType === 'structural') {
      htmlToInsert = `<div id="sigedoc-struct-${cleanTag}" data-var="${tag}" class="sigedoc-struct sigedoc-structural-binding">${tag}</div>`;
    } else if (wrapperType === 'binding') {
      htmlToInsert = `<span id="sigedoc-var-${cleanTag}" data-var="${tag}" class="sigedoc-var sigedoc-dynamic-binding" style="background-color: #fff3cd; border-bottom: 1px dashed #ffc107;">${tag}</span>`;
    }

    if (this.editorStrategy) {
      this.editorStrategy.insertTextAtCursor(htmlToInsert);
    } else {
      // Fallback
      this.internalCuerpo.set(this.internalCuerpo() + ' ' + htmlToInsert);
    }
  } 

  replaceTagsInBody() {
    let content = this.internalCuerpo();
    if (!content) return;
    const dict = this.localDictionary();
    
    // Parse the HTML content to safely manipulate DOM nodes
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    let hasChanges = false;
    
    for (const [key, value] of Object.entries(dict)) {
      if (value !== '') {
        const fullTag = '{{' + key + '}}';
        const cleanTag = key.replace(/[{}]/g, '');
        
        // 1. Update existing span markers first
        const existingSpans = doc.querySelectorAll(`[data-var="${fullTag}"]`);
        if (existingSpans.length > 0) {
          existingSpans.forEach(span => {
            if (span.innerHTML !== value) {
              span.innerHTML = value;
              hasChanges = true;
            }
          });
        }
        
        // 2. Replace raw tags in text nodes that haven't been wrapped yet
        // We only want to replace inside text nodes, not inside HTML attributes
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
        let node;
        const nodesToReplace = [];
        
        while (node = walker.nextNode()) {
          if (node.nodeValue && node.nodeValue.includes(fullTag)) {
            nodesToReplace.push(node);
          }
        }
        
        nodesToReplace.forEach(textNode => {
          const parts = textNode.nodeValue!.split(fullTag);
          if (parts.length > 1) {
            const fragment = doc.createDocumentFragment();
            parts.forEach((part, index) => {
              fragment.appendChild(doc.createTextNode(part));
              if (index < parts.length - 1) {
                const span = doc.createElement('span');
                span.id = `sigedoc-var-${cleanTag}`;
                span.setAttribute('data-var', fullTag);
                span.className = 'sigedoc-var sigedoc-dynamic-binding';
                span.innerHTML = value;
                // Add a visual styling for the editor
                span.style.backgroundColor = '#fff3cd'; // Light yellow highlight
                span.style.borderBottom = '1px dashed #ffc107';
                fragment.appendChild(span);
              }
            });
            if (textNode.parentNode) {
              textNode.parentNode.replaceChild(fragment, textNode);
              hasChanges = true;
            }
          }
        });
      }
    }
    
    if (hasChanges) {
      this.internalCuerpo.set(doc.body.innerHTML);
    }
  }
}


