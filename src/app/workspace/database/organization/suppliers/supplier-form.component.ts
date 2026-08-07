import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { SupplierDTO } from './supplier.dto';
import { SupplierService } from './supplier.service';
import { SUPPLIER_FORM_CONFIG } from './supplier-form.config';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Crear Nuevo Proveedor"
      titleEdit="Editar Información del Proveedor"
      subtitle="Complete los datos comerciales y de contacto."
      breadcrumbLabel="Directorio de Proveedores"
      breadcrumbRoute="/database/organization/suppliers"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty"
      [isFormInvalid]="false" [globalErrors]="globalErrors()" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">

      <app-dynamic-form 
        [config]="formConfig" 
        [formGroup]="form"
        [isEditMode]="isEditMode()">
        <ng-template dynamicField let-field="field" let-formGroup="formGroup">
          <div *ngIf="field.customTypeKey === 'CONTACTS_ARRAY'" class="flex flex-col gap-4 w-full" [formGroup]="formGroup">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">Contactos</h3>
              <button type="button" (click)="addContact(field.key)" class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                + Agregar Contacto
              </button>
            </div>
            
            <div [formArrayName]="field.key" class="flex flex-col gap-4">
              <div *ngFor="let contact of getContactsArray(field.key).controls; let i = index" [formGroupName]="i" class="p-4 border border-gray-200 dark:border-gray-750 rounded-lg flex flex-col gap-4 bg-gray-50 dark:bg-gray-800/40 relative">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Contacto #{{i + 1}}</h4>
                  <button type="button" (click)="removeContact(field.key, i)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input type="text" formControlName="name" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre completo">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                    <input type="text" formControlName="job" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Ej. Gerente de Ventas">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" formControlName="email" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="correo@ejemplo.com">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                    <input type="text" formControlName="phone" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="+123456789">
                  </div>
                </div>
              </div>
            </div>
            
            <div *ngIf="getContactsArray(field.key).controls.length === 0" class="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              No hay contactos agregados a este proveedor.
            </div>
          </div>
        </ng-template>
      </app-dynamic-form>

    </app-form-page-wrapper>
  `
})
export class SupplierFormComponent extends BaseFormController<SupplierDTO> {
  protected apiService = inject(SupplierService);
  protected override controllerConfig = {
    mainRoute: '/database/organization/suppliers',
    cacheKeyToInvalidate: 'SUPPLIERS',
    formConfig: SUPPLIER_FORM_CONFIG
  };

  getContactsArray(key: string): FormArray {
    return this.form.get(key) as FormArray;
  }

  addContact(key: string) {
    const contactsArray = this.form.get(key) as FormArray;
    if (contactsArray) {
      contactsArray.push(
        new FormGroup({
          name: new FormControl(''),
          job: new FormControl(''),
          email: new FormControl(''),
          phone: new FormControl('')
        })
      );
    }
  }

  removeContact(key: string, index: number) {
    const contactsArray = this.form.get(key) as FormArray;
    if (contactsArray) {
      contactsArray.removeAt(index);
    }
  }
}
