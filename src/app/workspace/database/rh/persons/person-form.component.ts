import { Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormController } from '@baseclass/base-form.controller';
import { PersonDTO } from './person.dto';
import { PersonService } from './person.service';
import { PERSON_FORM_CONFIG } from './person-form.config';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@system-shared/dynamic-form/form-page-wrapper.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent, IconComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Registrar Persona"
      titleEdit="Editar Persona"
      [contextText]="contextText()"
      subtitle="Complete los campos requeridos para la persona."
      breadcrumbLabel="Directorio de Personas"
      [breadcrumbRoute]="controllerConfig.mainRoute"
      [isEditMode]="isEditMode()"
      [isLoading]="isLoading()"
      [showSkeleton]="!form.dirty"
      [isFormInvalid]="form.invalid" [globalErrors]="globalErrors()" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">
      <div class="mb-4 flex justify-end px-8 pt-4">
        <button type="button" class="text-xs font-semibold text-theme-primary bg-white border border-theme-primary hover:bg-theme-primary hover:text-white transition-colors px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm" (click)="extractFromCurp()">
          <icon icon="Clipboard" class="w-4 h-4"></icon>
          Extraer datos desde CURP
        </button>
      </div>

      <app-dynamic-form 
        [config]="controllerConfig.formConfig" 
        [formGroup]="form"
        [isEditMode]="isEditMode()">
      </app-dynamic-form>

    </app-form-page-wrapper>
  `
})
export class PersonFormComponent extends BaseFormController<PersonDTO> implements OnInit {
  protected override apiService = inject(PersonService);
  public override controllerConfig = PERSON_FORM_CONFIG;

  override ngOnInit() {
    super.ngOnInit();

    // 1. Validadores en Frontend alineados con el Backend
    const curpControl = this.form.get('curp');
    if (curpControl) {
      curpControl.setValidators([
        Validators.minLength(18),
        Validators.maxLength(18),
        Validators.pattern(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/)
      ]);
      curpControl.updateValueAndValidity({ emitEvent: false });
    }

    const rfcControl = this.form.get('rfc');
    if (rfcControl) {
      rfcControl.setValidators([
        Validators.minLength(12),
        Validators.maxLength(13),
        Validators.pattern(/^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}|AAAA0000TTX\d{2})$/)
      ]);
      rfcControl.updateValueAndValidity({ emitEvent: false });
    }

    const emailControl = this.form.get('email');
    if (emailControl) {
      emailControl.setValidators([
        Validators.email
      ]);
      emailControl.updateValueAndValidity({ emitEvent: false });
    }

    // 2. UX PREMIUM: Autocompletado inteligente desde CURP
    curpControl?.valueChanges.subscribe(val => {
      if (val && val.length === 18) {
        this.extractFromCurp();
      }
    });
  }

  extractFromCurp() {
    const curpControl = this.form.get('curp');
    if (!curpControl || !curpControl.value) return;
    
    const curpStr = curpControl.value.toUpperCase();
    if (/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/.test(curpStr)) {
      const yy = curpStr.substring(4, 6);
      const mm = curpStr.substring(6, 8);
      const dd = curpStr.substring(8, 10);
      
      const mmNum = parseInt(mm, 10);
      const ddNum = parseInt(dd, 10);
      
      if (mmNum >= 1 && mmNum <= 12 && ddNum >= 1 && ddNum <= 31) {
        const currentYear2Digits = new Date().getFullYear() % 100;
        const yearNum = parseInt(yy, 10);
        const century = yearNum <= currentYear2Digits ? '20' : '19';
        const fullYear = `${century}${yy}`;
        
        const birthDateStr = `${fullYear}-${mm}-${dd}`;
        const sexChar = curpStr.charAt(10);
        
        const birthControl = this.form.get('birth_date');
        const sexControl = this.form.get('sex');
        const rfcControl = this.form.get('rfc');
        
        if (birthControl) {
          birthControl.setValue(birthDateStr);
          birthControl.markAsDirty();
        }
        if (sexControl) {
          sexControl.setValue(sexChar);
          sexControl.markAsDirty();
        }
        if (rfcControl && !rfcControl.value) {
          rfcControl.setValue(curpStr.substring(0, 10));
          rfcControl.markAsDirty();
        }
      } else {
        alert('La fecha de nacimiento en la CURP parece ser inválida (' + dd + '/' + mm + '/' + yy + '). Verifica que esté bien escrita.');
      }
    } else {
      alert('La CURP no tiene el formato correcto o está incompleta.');
    }
  }

  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
        const nameText = `${data.prefix || ''} ${data.name || ''} ${data.first_surname || ''}`.trim();
        this.contextText.set(nameText || 'Detalles de persona');
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
