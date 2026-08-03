import { Component, input, forwardRef, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { VariablePillsComponent, VariablePill } from '../../ui/variable-pills/variable-pills.component';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, VariablePillsComponent, LabelComponent],
  templateUrl: './template-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TemplateEditorComponent),
      multi: true
    }
  ],
  host: {
    'class': 'flex flex-col min-w-0 w-full'
  }
})
export class TemplateEditorComponent implements ControlValueAccessor {
  @ViewChild('textArea', { static: false }) textAreaRef!: ElementRef<HTMLTextAreaElement>;

  label = input<string>('');
  placeholder = input<string>('Ingrese su plantilla aquí...');
  variables = input<VariablePill[]>([]);
  rows = input<number>(10);

  value = signal<string>('');
  isDisabled = signal<boolean>(false);

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur() {
    this.onTouched();
  }

  insertVariable(key: string) {
    if (this.isDisabled()) return;

    const textarea = this.textAreaRef?.nativeElement;
    if (!textarea) return;

    const currentVal = this.value();
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const beforeText = currentVal.substring(0, startPos);
    const afterText = currentVal.substring(endPos, currentVal.length);

    const newVal = beforeText + key + afterText;
    
    this.value.set(newVal);
    this.onChange(newVal);

    // Restore cursor position after the inserted key
    setTimeout(() => {
      textarea.focus();
      const newPos = startPos + key.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }
}
