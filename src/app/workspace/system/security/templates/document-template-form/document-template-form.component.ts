import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DocumentTemplateDTO } from '../document-template.dto';
import { DocumentTemplateService } from '../document-template.service';
import { DOCUMENT_TEMPLATE_FORM_CONFIG } from './document-template-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-document-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './document-template-form.component.html'
})
export class DocumentTemplateFormComponent extends BaseFormController<DocumentTemplateDTO> {
  protected override apiService = inject(DocumentTemplateService);
  protected override controllerConfig = {
    mainRoute: '/system/security/templates',
    cacheKeyToInvalidate: 'DOCUMENT_TEMPLATES',
    formConfig: DOCUMENT_TEMPLATE_FORM_CONFIG
  };

  public override async onSave() {
    // Si index_order está vacío, nulo o indefinido, lo forzamos a null
    const indexCtrl = this.form.get('index_order');
    if (indexCtrl && (indexCtrl.value === '' || indexCtrl.value === null || indexCtrl.value === undefined)) {
      indexCtrl.setValue(null);
    }
    await super.onSave();
  }
}
