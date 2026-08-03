import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig, FormGroupConfig } from '@interfaces/dynamic-form.interface';
import { ApiSelectComponent } from './api-select.component';
import { FilterCityComponent } from '../filters/filter-city.component';
import { CountrySelectComponent } from '@workspace-shared/components/selects/country-select/country-select.component';
import { StateSelectComponent } from '@workspace-shared/components/selects/state-select/state-select.component';
import { CitySelectComponent } from '@workspace-shared/components/selects/city-select/city-select.component';
import { DynamicInputComponent } from './controls/dynamic-input.component';
import { DynamicTextareaComponent } from './controls/dynamic-textarea.component';
import { DynamicSelectComponent } from './controls/dynamic-select.component';
import { DynamicRadioComponent } from './controls/dynamic-radio.component';
import { DynamicBooleanComponent } from './controls/dynamic-boolean.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApiSelectComponent, FilterCityComponent, CountrySelectComponent, StateSelectComponent, CitySelectComponent, DynamicInputComponent, DynamicTextareaComponent, DynamicSelectComponent, DynamicRadioComponent, DynamicBooleanComponent],
  template: `
    <div [formGroup]="formGroup()" class="space-y-10">
      @for (section of config(); track section.title) {
        <div class="space-y-4">
          
          <!-- Encabezado de la Sección -->
          @if (section.title) {
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-theme-primary inline-block pb-1">{{ section.title }}</h3>
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
                    
                    <!-- COUNTRY SELECT -->
                    @else if (field.type === 'country-select') {
                      <app-country-select
                        [formControlName]="field.key"
                        [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                      </app-country-select>
                    }

                    <!-- STATE SELECT -->
                    @else if (field.type === 'state-select') {
                      <app-state-select
                        [formControlName]="field.key"
                        [countryId]="formGroup().get('country_id')?.value || null"
                        [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                      </app-state-select>
                    }

                    <!-- CITY SELECT -->
                    @else if (field.type === 'city-select') {
                      <app-city-select
                        [formControlName]="field.key"
                        [stateId]="formGroup().get('state_id')?.value || null"
                        [ngClass]="{'pointer-events-none opacity-60': isReadonly(field)}">
                      </app-city-select>
                    }
                    
                    <!-- 2. ENUM (Radio o Select Local) -->
                    @else if (field.type === 'enum' && field.options) {
                      @if (field.options.length <= 4) {
                        <app-dynamic-radio [control]="control" [field]="field" [isReadonly]="isReadonly(field)"></app-dynamic-radio>
                      } @else {
                        <app-dynamic-select [control]="control" [field]="field" [isReadonly]="isReadonly(field)"></app-dynamic-select>
                      }
                    }

                    <!-- 3. BOOLEAN (Toggle Switch) -->
                    @else if (field.type === 'boolean') {
                      <app-dynamic-boolean [control]="control" [field]="field" [isReadonly]="isReadonly(field)"></app-dynamic-boolean>
                    }
                    
                    <!-- 4. INPUTS ESTÁNDAR (text, number, tel, etc) -->
                    @else if (field.type !== 'custom' && field.type !== 'textarea') {
                      <app-dynamic-input [control]="control" [field]="field" [isReadonly]="isReadonly(field)"></app-dynamic-input>
                    }

                    <!-- 4.1 TEXTAREA (Para descripciones largas) -->
                    @else if (field.type === 'textarea') {
                      <app-dynamic-textarea [control]="control" [field]="field" [isReadonly]="isReadonly(field)"></app-dynamic-textarea>
                    }

                    <!-- 5. COMPONENTES CUSTOM (Ej. LOCATION_FILTER) -->
                    @else if (field.type === 'custom' && field.customTypeKey === 'LOCATION_FILTER') {
                      <app-filter-city
                        [isNew]="!isEditMode()"
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
