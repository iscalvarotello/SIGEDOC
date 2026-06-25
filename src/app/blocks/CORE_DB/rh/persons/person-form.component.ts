import { Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormController } from '@app/shared/classes/base-form.controller';
import { PersonDTO } from './person.dto';
import { PersonService } from './person.service';
import { PERSON_FORM_CONFIG } from './person-form.config';
import { DynamicFormComponent } from '@app/shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@app/shared/components/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent],
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
      [isFormInvalid]="form.invalid" 
      (onSave)="onSave()"
      (onCancel)="onCancel()">

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
        const curpStr = val.toUpperCase();
        if (/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/.test(curpStr)) {
          // Extraer fecha de nacimiento (posiciones 4 a 9: YYMMDD)
          const yy = curpStr.substring(4, 6);
          const mm = curpStr.substring(6, 8);
          const dd = curpStr.substring(8, 10);
          
          // Inferir siglo
          const currentYear2Digits = new Date().getFullYear() % 100;
          const yearNum = parseInt(yy, 10);
          const century = yearNum <= currentYear2Digits ? '20' : '19';
          const fullYear = `${century}${yy}`;
          
          const birthDateStr = `${fullYear}-${mm}-${dd}`;
          
          // Extraer sexo (posición 10: H o M)
          const sexChar = curpStr.charAt(10);
          
          const birthControl = this.form.get('birth_date');
          const sexControl = this.form.get('sex');
          const rfcControl = this.form.get('rfc');
          
          if (birthControl && !birthControl.value) {
            birthControl.setValue(birthDateStr);
            birthControl.markAsDirty();
          }
          if (sexControl && !sexControl.value) {
            sexControl.setValue(sexChar);
            sexControl.markAsDirty();
          }
          if (rfcControl && !rfcControl.value) {
            rfcControl.setValue(curpStr.substring(0, 10));
            rfcControl.markAsDirty();
          }
        }
      }
    });
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
