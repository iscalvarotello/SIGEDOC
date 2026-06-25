import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig, FormGroupConfig } from '../../interfaces/dynamic-form.interface';
import { ApiSelectComponent } from './api-select.component';
import { FilterCityComponent } from '../filters/filter-city.component';
import { ContactsArrayComponent } from '../custom-fields/contacts-array.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApiSelectComponent, FilterCityComponent, ContactsArrayComponent],
  template: `
    <div [formGroup]="formGroup()" class="space-y-10">
      @for (section of config(); track section.title) {
        <div class="space-y-4">
          
          <!-- Encabezado de la Sección -->
          @if (section.title) {
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-[#691C32] inline-block pb-1">{{ section.title }}</h3>
              @if (section.subtitle) {
                <p class="text-xs text-gray-500 mt-2">{{ section.subtitle }}</p>
              }
            </div>
          }

          <!-- Grid de Campos -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            @for (field of section.fields; track field.key) {
              
              <!-- Verificamos la Visibilidad Condicional -->
              @if (!(field.hideOnCreate && !isEditMode()) && !(field.hideOnEdit && isEditMode())) {
                
                <!-- Verificamos que el control exista en el FormGroup -->
                @if (getControl(field.key); as control) {
                  
                  @if (field.type === 'hidden') {
                    <input type="hidden" [formControlName]="field.key">
                  } @else {
                    <div [ngClass]="{'col-span-1 sm:col-span-2': field.gridSpan === 2, 'col-span-1': field.gridSpan !== 2}">
                      
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        {{ field.label }} @if (field.required) { <span class="text-red-500">*</span> }
                      </label>
                      
                      <!-- MOTOR RENDERIZADOR (SWITCH DE COMPONENTES) -->
                    
                    <!-- 1. API SELECT (Control Inteligente) -->
                    @if (field.type === 'api-select') {
                      <app-api-select 
                        [control]="control" 
                        [field]="field" 
                        [formGroup]="formGroup()"
                        [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                      </app-api-select>
                    } 
                    
                    <!-- 2. ENUM (Radio o Select Local) -->
                    @else if (field.type === 'enum' && field.options) {
                      @if (field.options.length <= 4) {
                        <div class="flex flex-wrap gap-5 mt-3" [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                          @for (opt of field.options; track opt.value) {
                            <label class="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                [formControlName]="field.key" 
                                [value]="opt.value" 
                                class="w-5 h-5 text-[#691C32] border-gray-300 focus:ring-[#691C32] dark:border-gray-600 dark:bg-gray-800 transition-colors"
                              >
                              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#691C32] dark:group-hover:text-[#BC955C] transition-colors">{{ opt.label }}</span>
                            </label>
                          }
                        </div>
                      } @else {
                        <div class="relative" [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                          <select 
                            [formControlName]="field.key"
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all appearance-none"
                            [ngClass]="{'border-red-300 focus:ring-red-500/50 focus:border-red-500': control.invalid && control.touched}">
                            <option value="" disabled selected>{{ field.placeholder || 'Seleccione una opción...' }}</option>
                            @for (opt of field.options; track opt.value) {
                              <option [value]="opt.value">{{ opt.label }}</option>
                            }
                          </select>
                          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </div>
                        </div>
                      }
                    }

                    <!-- 3. BOOLEAN (Toggle Switch) -->
                    @else if (field.type === 'boolean') {
                      <label class="relative inline-flex items-center cursor-pointer mt-2" [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                        <input type="checkbox" [formControlName]="field.key" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#691C32]/50 dark:peer-focus:ring-[#691C32]/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#691C32]"></div>
                        <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{{ field.placeholder || (control.value ? 'Activado' : 'Desactivado') }}</span>
                      </label>
                    }
                    
                    <!-- 4. INPUTS ESTÁNDAR (text, number, tel, etc) -->
                    @else if (field.type !== 'custom' && field.type !== 'textarea') {
                      <input 
                        [type]="field.type" 
                        [formControlName]="field.key"
                        [placeholder]="field.placeholder || ''"
                        [readonly]="isReadonly(field)"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all"
                        [ngClass]="{
                          'border-red-300 focus:ring-red-500/50 focus:border-red-500': control.invalid && control.touched,
                          'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed': isReadonly(field)
                        }"
                      >
                    }

                    <!-- 4.1 TEXTAREA (Para descripciones largas) -->
                    @else if (field.type === 'textarea') {
                      <textarea
                        [formControlName]="field.key"
                        [placeholder]="field.placeholder || ''"
                        [readonly]="isReadonly(field)"
                        rows="4"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all resize-y"
                        [ngClass]="{
                          'border-red-300 focus:ring-red-500/50 focus:border-red-500': control.invalid && control.touched,
                          'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed': isReadonly(field)
                        }"
                      ></textarea>
                    }

                    <!-- 5. COMPONENTES CUSTOM (Ej. LOCATION_FILTER) -->
                    @else if (field.type === 'custom' && field.customTypeKey === 'LOCATION_FILTER') {
                      <app-filter-city
                        [layout]="field.customProps?.layout || 'horizontal'"
                        [initialCountryId]="formGroup().get(field.customProps?.countryKey || 'country_id')?.value || ''"
                        [initialStateId]="formGroup().get(field.customProps?.stateKey || 'state_id')?.value || ''"
                        [initialCityId]="control.value || ''"
                        (onCountrySelect)="formGroup().get(field.customProps?.countryKey || 'country_id')?.setValue($event.countryId)"
                        (onStateSelect)="formGroup().get(field.customProps?.stateKey || 'state_id')?.setValue($event.stateId)"
                        (onCitySelect)="control.setValue($event.cityId); control.markAsDirty(); control.markAsTouched()"
                      ></app-filter-city>
                    }

                    <!-- 6. CONTACTOS ARRAY -->
                    @else if (field.type === 'custom' && field.customTypeKey === 'CONTACTS_ARRAY') {
                      <app-contacts-array
                        [formControlName]="field.key"
                      ></app-contacts-array>
                    }
                    
                    <!-- MENSAJES DE ERROR GLOBALES -->
                    @if (control.invalid && (control.touched || control.hasError('serverError'))) {
                      @if (control.hasError('serverError')) {
                        <p class="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          {{ control.getError('serverError') }}
                        </p>
                      } @else {
                        <p class="mt-1.5 text-xs text-red-500 font-medium">Este campo es requerido o tiene formato inválido.</p>
                      }
                    }

                  </div>
                  }
                }
              }

            }

          </div>
        </div>
      }
    </div>
  `
})
export class DynamicFormComponent {
  config = input.required<FormGroupConfig[]>();
  formGroup = input.required<FormGroup>();
  isEditMode = input<boolean>(false);

  getControl(key: string): FormControl | null {
    const ctrl = this.formGroup().get(key);
    return ctrl instanceof FormControl ? ctrl : null;
  }

  isReadonly(field: FormFieldConfig): boolean {
    if (field.readonlyOnCreate && !this.isEditMode()) return true;
    if (field.readonlyOnEdit && this.isEditMode()) return true;
    return false;
  }
}
