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
import { EditorSkeletonComponent } from '@system-shared/loading-skeletons/editor-skeleton/editor-skeleton.component';

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
    DocumentTypeSelectComponent,
    EditorSkeletonComponent
  ],
  templateUrl: './html-template-form.component.html'
})
export class HtmlTemplateFormComponent extends BaseFormController<HtmlTemplate> implements OnInit {
  @ViewChild('headerEditor') headerEditor?: EditorInjectionStrategy;
  @ViewChild('bodyEditor') bodyEditor?: EditorInjectionStrategy;
  @ViewChild('footerEditor') footerEditor?: EditorInjectionStrategy;
  
  protected override apiService = inject(HtmlTemplateService);
  protected override controllerConfig: any = {
    mainRoute: '/system/settings/html-templates',
    formConfig: []
  };

  public tags = signal<HtmlTemplateTag[]>([]);
  public activeTab = signal<'header_page' | 'body_text' | 'footer_page' | 'css' | 'typography'>('body_text');

  public override form: FormGroup = inject(FormBuilder).group({
    id: [null],
    institutionId: [null],
    document_class: ['', [Validators.required]],
    page_size: ['letter'],
    margin_top: [25],
    margin_bottom: [25],
    margin_left: [25],
    margin_right: [25],
    header_page: [''],
    body_text: [''],
    footer_page: [''],
    css: [''],
    font_family: ['Arial, sans-serif'],
    font_size: ['11pt'],
    line_height: ['1.5'],
    paragraph_spacing: ['15px']
  });

  public onDocumentClassChange(docClass: string) {
    this.form.get('document_class')?.setValue(docClass);
  }

  // Prevents BaseFormController from wiping our manually constructed form
  protected override buildForm(): void {
    // No-op
  }

  public override async ngOnInit() {
    super.ngOnInit();
    
    // Set institutionId from session
    let tenantId = localStorage.getItem('system_tenant_id');
    if (tenantId) {
      tenantId = tenantId.replace(/"/g, ''); // Fix if stored with quotes
      this.form.get('institutionId')?.setValue(tenantId);
    } else {
      console.warn('No se encontr system_tenant_id en localStorage');
    }

    try {
      const tagsData = await this.apiService.getTags();
      this.tags.set(tagsData || []);
    } catch (error) {
      console.error('Error cargando tags:', error);
    }
  }

  public override async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor complete todos los campos obligatorios o corrija los errores marcados en el formulario.');
      return;
    }

    this.isLoading.set(true);
    
    const rawValue = this.form.getRawValue();
    let tenantId = localStorage.getItem('system_tenant_id');
    
    if (!tenantId) {
      const userDataStr = localStorage.getItem('system_user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          tenantId = userData.institution_id || (userData.user && userData.user.institution_id);
        } catch(e) {}
      }
    }
    
    const finalPayload: any = { 
      ...rawValue, 
      institutionId: tenantId ? tenantId.replace(/"/g, '') : null 
    };

    Object.keys(finalPayload).forEach(key => {
      if (finalPayload[key] === null || finalPayload[key] === undefined) {
        delete finalPayload[key];
      }
    });

    delete finalPayload.id;

    try {
      if ((this as any).isEditMode() && (this as any).itemId()) {
        await this.apiService.update((this as any).itemId()!, finalPayload);
      } else {
        await this.apiService.create(finalPayload);
      }
      
      alert('Registro guardado correctamente');
      const router = (this as any).router;
      if (router) {
        router.navigate([this.controllerConfig.mainRoute]);
      } else {
        window.history.back();
      }
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert('Se encontraron problemas al guardar. Revisa la consola para ms detalles.');
    } finally {
      this.isLoading.set(false);
    }
  }

  public insertTag(tag: string) {
    let activeEditor: EditorInjectionStrategy | undefined;
    
    if (this.activeTab() === 'header_page') activeEditor = this.headerEditor;
    if (this.activeTab() === 'body_text') activeEditor = this.bodyEditor;
    if (this.activeTab() === 'footer_page') activeEditor = this.footerEditor;

    if (activeEditor) {
      activeEditor.insertTextAtCursor(tag);
      return;
    }
    
    // Fallback if no strategy is found
    navigator.clipboard.writeText(tag).then(() => {
      alert(`Etiqueta ${tag} copiada al portapapeles`);
    });
  }
}
