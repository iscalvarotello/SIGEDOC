import { Component, forwardRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { EditorInjectionStrategy } from '@system-shared/form/editor-injection.strategy';
import { Editor as TinyMCEEditor } from 'tinymce';

@Component({
  selector: 'app-tinymce-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  templateUrl: './tinymce-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceEditorComponent),
      multi: true
    },
    {
      provide: EditorInjectionStrategy,
      useExisting: forwardRef(() => TinymceEditorComponent)
    }
  ]
})
export class TinymceEditorComponent implements ControlValueAccessor, EditorInjectionStrategy {
  @Input() id = 'tinymce-editor-' + Math.random().toString(36).substring(2, 9);
  @Input() placeholder = 'Escriba aquí...';

  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  
  private tinymceInstance: TinyMCEEditor | null = null;
  
  value: string = '';
  isDisabled = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    license_key: 'gpl',
    height: 600,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | fontfamily fontsize | ' +
      'bold italic underline strikethrough | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'table | blocks forecolor backcolor | removeformat | help',
    font_size_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    setup: (editor: TinyMCEEditor) => {
      this.tinymceInstance = editor;
      editor.on('init', () => {
        if (this.placeholder && !this.value) {
          // Placeholder implementation if needed, though TinyMCE has its own or we just leave empty
        }
      });
    }
  };

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onModelChange(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouch();
  }

  // EditorInjectionStrategy method
  insertTextAtCursor(text: string): void {
    if (this.tinymceInstance) {
      this.tinymceInstance.execCommand('mceInsertContent', false, text);
    } else {
      // Fallback
      this.value = this.value + text;
      this.onChange(this.value);
    }
  }
}
