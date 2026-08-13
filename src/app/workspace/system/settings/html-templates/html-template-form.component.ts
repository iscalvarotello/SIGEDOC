import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormController } from '@baseclass/base-form.controller';
import { HtmlTemplate, HtmlTemplateTag } from './interfaces/html-template.interface';
import { HtmlTemplateService } from './services/html-template.service';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { TinymceEditorComponent } from '@system-shared/form/tinymce-editor/tinymce-editor.component';
import { EditorInjectionStrategy } from '@system-shared/form/editor-injection.strategy';
import { InputFieldComponent } from '@system-shared/form/input/input-field.component';
import { TextAreaComponent } from '@system-shared/form/input/text-area.component';
import { DocumentTypeSelectComponent } from '@workspace-shared/components/selects/document-type-select/document-type-select.component';

@Component({
  selector: 'app-html-template-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormPageWrapperComponent,
    TinymceEditorComponent,
    InputFieldComponent,
    TextAreaComponent,
    DocumentTypeSelectComponent
  ],
  templateUrl: './html-template-form.component.html'
})
export class HtmlTemplateFormComponent extends BaseFormController<HtmlTemplate> implements OnInit {
  @ViewChild(EditorInjectionStrategy) editorStrategy?: EditorInjectionStrategy;
  
  protected override apiService = inject(HtmlTemplateService);
  protected override controllerConfig: any = {
    mainRoute: '/system/settings/html-templates',
    formConfig: []
  };

  public tags = signal<HtmlTemplateTag[]>([]);
  public activeTab = signal<'header' | 'body' | 'footer' | 'page_footer' | 'css'>('body');

  public override form: FormGroup = inject(FormBuilder).group({
    id: [null],
    name: ['Plantilla', [Validators.required]],
    document_class: ['', [Validators.required]],
    margin_top: [25],
    margin_bottom: [25],
    margin_left: [25],
    margin_right: [25],
    header: [''],
    body: [''],
    footer: [''],
    page_footer: [''],
    css: ['']
  });

  public onDocumentClassChange(docClass: string) {
    this.form.get('document_class')?.setValue(docClass);
    // Auto-fill the hidden name field
    const nameMap: any = {
      'memo': 'Memorándum',
      'oficio': 'Oficio',
      'ti': 'Tarjeta Informativa',
      'circular': 'Circular',
      'incidencia': 'Incidencia',
      'contrato': 'Contrato',
      'convenio': 'Convenio'
    };
    const templateName = nameMap[docClass] ? `Plantilla de ${nameMap[docClass]}` : 'Plantilla';
    this.form.get('name')?.setValue(templateName);
  }

  public override async ngOnInit() {
    super.ngOnInit();
    try {
      const tagsData = await this.apiService.getTags();
      this.tags.set(tagsData || []);
    } catch (error) {
      console.error('Error cargando tags:', error);
    }
  }

  public insertTag(tag: string) {
    if (this.editorStrategy) {
      this.editorStrategy.insertTextAtCursor(tag);
    } else {
      navigator.clipboard.writeText(tag).then(() => {
        alert(`Etiqueta ${tag} copiada al portapapeles`);
      });
    }
  }
}
