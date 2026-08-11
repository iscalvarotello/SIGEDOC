import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TiptapEditorDirective],
  templateUrl: './rich-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true
    }
  ]
})
export class RichEditorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder = 'Escriba aquí...';
  
  editor!: Editor;
  value = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell
      ],
      editorProps: {
        attributes: {
          class: 'focus:outline-none min-h-[280px]',
        },
      },
      content: this.value,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        this.value = html;
        this.onChange(html);
        this.onTouched();
      },
    });
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  writeValue(value: any): void {
    this.value = value || '';
    if (this.editor && this.editor.getHTML() !== this.value) {
      this.editor.commands.setContent(this.value, { emitUpdate: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.editor.setEditable(!isDisabled);
  }

  insertTextAtCursor(text: string) {
    if (this.editor) {
      this.editor.commands.insertContent(text);
      this.editor.commands.focus();
    }
  }
}
