import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DocumentTemplateDTO } from '../document-template.dto';
import { DocumentTemplateService } from '../document-template.service';
import { DOCUMENT_TEMPLATE_FORM_CONFIG } from './document-template-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { FileUploaderComponent } from '@system-shared/media/file-uploader/file-uploader.component';

@Component({
  selector: 'app-document-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent, FileUploaderComponent],
  templateUrl: './document-template-form.component.html'
})
export class DocumentTemplateFormComponent extends BaseFormController<DocumentTemplateDTO> {
  protected override apiService = inject(DocumentTemplateService);
  protected override controllerConfig = {
    mainRoute: '/system/security/templates',
    cacheKeyToInvalidate: 'DOCUMENT_TEMPLATES',
    formConfig: DOCUMENT_TEMPLATE_FORM_CONFIG
  };

  public wordFile = signal<File | null>(null);

  public override async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor complete todos los campos obligatorios o corrija los errores.');
      return;
    }

    const formValue = { ...this.form.value };
    if (formValue.index_order === '' || formValue.index_order === null || formValue.index_order === undefined) {
      formValue.index_order = null;
    }

    try {
      this.isLoading.set(true);
      const formData = new FormData();
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== '') {
          formData.append(key, formValue[key]);
        }
      });
      if (this.wordFile()) {
        formData.append('word_file', this.wordFile()!);
      }

      if (this.isEditMode() && this.itemId()) {
        await this.apiService.updateWithFile(this.itemId()!, formData, this.controllerConfig.cacheKeyToInvalidate);
      } else {
        await this.apiService.createWithFile(formData, this.controllerConfig.cacheKeyToInvalidate);
      }

      if (typeof this.apiService.getAll === 'function') {
        await this.apiService.getAll();
      }

      this.navigateToMain();
    } catch (error: any) {
      console.error('Error guardando plantilla:', error);
      alert('Ocurrió un error al guardar la plantilla.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
