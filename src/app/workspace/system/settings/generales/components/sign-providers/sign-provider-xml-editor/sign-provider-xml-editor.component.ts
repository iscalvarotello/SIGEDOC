import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignProvider } from '../../../interfaces/sign-provider.interface';
import { TemplateEditorComponent } from '@system-shared/form/template-editor/template-editor.component';
import { SignProvidersService } from '../../../services/sign-providers.service';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-sign-provider-xml-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TemplateEditorComponent, ActionButtonComponent],
  templateUrl: './sign-provider-xml-editor.component.html',
  host: {
    'class': 'flex flex-col bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm mt-6'
  }
})
export class SignProviderXmlEditorComponent {
  private fb = inject(FormBuilder);
  private signProvidersService = inject(SignProvidersService);

  provider = input.required<SignProvider>();
  save = output<{ id: string, xml_template: string }>();

  isSaving = input<boolean>(false);
  availableKeys = signal<{key: string, label: string}[]>([]);
  
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      xml_template: ['', Validators.required]
    });

    effect(() => {
      const p = this.provider();
      if (p) {
        this.form.patchValue({
          xml_template: p.xml_template || ''
        });
      }
    });

    this.loadXmlKeys();
  }

  private async loadXmlKeys() {
    try {
      const keys = await this.signProvidersService.getXmlKeys();
      this.availableKeys.set(keys || []);
    } catch (e) {
      console.error('Error loading XML keys', e);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.save.emit({
      id: this.provider().id,
      xml_template: this.form.value.xml_template
    });
  }
}
