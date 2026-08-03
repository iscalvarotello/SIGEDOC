import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DocumentTypeCatalogDTO } from '../document-type-catalog.dto';
import { DocumentTypeCatalogService } from '../document-type-catalog.service';
import { DOCUMENT_TYPE_CATALOG_FORM_CONFIG } from './document-type-catalog-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-document-type-catalog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  templateUrl: './document-type-catalog-form.component.html'
})
export class DocumentTypeCatalogFormComponent extends BaseFormController<DocumentTypeCatalogDTO> {
  protected override apiService = inject(DocumentTypeCatalogService);
  protected override controllerConfig = {
    mainRoute: '/system/security/document-types',
    cacheKeyToInvalidate: 'DOCUMENT_TYPE_CATALOGS',
    formConfig: DOCUMENT_TYPE_CATALOG_FORM_CONFIG
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
