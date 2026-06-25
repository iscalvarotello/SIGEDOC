import { Component, inject, OnInit } from '@angular/core';
import { BaseFormController } from '@app/shared/classes/base-form.controller';
import { JobPositionDTO } from './job-position.dto';
import { JobPositionService } from './job-position.service';
import { JOB_POSITION_FORM_CONFIG } from './job-position-form.config';
import { DynamicFormComponent } from '@app/shared/components/dynamic-form/dynamic-form.component';
import { FormPageWrapperComponent } from '@app/shared/components/dynamic-form/form-page-wrapper.component';

@Component({
  selector: 'app-job-position-form',
  standalone: true,
  imports: [DynamicFormComponent, FormPageWrapperComponent],
  template: `
    <app-form-page-wrapper
      titleNew="Registrar Puesto"
      titleEdit="Editar Puesto"
      [contextText]="contextText()"
      subtitle="Complete los campos del catálogo de puestos jerárquicos."
      breadcrumbLabel="Catálogo de Puestos"
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
export class JobPositionFormComponent extends BaseFormController<JobPositionDTO> implements OnInit {
  protected override apiService = inject(JobPositionService);
  public override controllerConfig = JOB_POSITION_FORM_CONFIG;

  override ngOnInit() {
    super.ngOnInit();

    // UX PREMIUM: Inflector Gramatical en Español al perder el foco (onBlur)
    const nameControl = this.form.get('name');
    if (nameControl) {
      const currentVal = nameControl.value;
      const validators = nameControl.validator;
      
      // Re-creamos el control con updateOn: 'blur' para evitar interferir con la escritura en tiempo real
      const newControl = this.fb.control(currentVal, {
        validators: validators,
        updateOn: 'blur'
      });
      
      this.form.setControl('name', newControl);
      
      newControl.valueChanges.subscribe(val => {
        this.autoInflectNames(val);
      });
    }
  }

  private autoInflectNames(maleName: string) {
    if (!maleName || maleName.trim().length < 3) return;

    const femaleControl = this.form.get('name_fem');
    const pluralControl = this.form.get('name_plural');

    let femaleName = '';
    let pluralName = '';

    const nameLower = maleName.toLowerCase();
    
    // Si contiene conectores como " de " (e.g. "Director de Área", "Jefe de Departamento")
    if (nameLower.includes(' de ')) {
      const parts = maleName.split(/\s+de\s+/i);
      const mainWord = parts[0];
      const rest = parts.slice(1).join(' de ');
      
      const mainFemale = this.inflectWordFemale(mainWord);
      const mainPlural = this.inflectWordPlural(mainWord);
      
      femaleName = `${mainFemale} de ${rest}`;
      pluralName = `${mainPlural} de ${rest}`;
    } else {
      // Nombre simple o compuesto (e.g. "Secretario técnico", "Asesor")
      const words = maleName.split(/\s+/);
      const mainWord = words[0];
      const adjectives = words.slice(1).join(' ');
      
      const mainFemale = this.inflectWordFemale(mainWord);
      const mainPlural = this.inflectWordPlural(mainWord);
      
      if (adjectives) {
        const adjFemale = this.inflectAdjectiveFemale(adjectives);
        const adjPlural = this.inflectAdjectivePlural(adjectives);
        
        femaleName = `${mainFemale} ${adjFemale}`;
        pluralName = `${mainPlural} ${adjPlural}`;
      } else {
        femaleName = mainFemale;
        pluralName = mainPlural;
      }
    }

    if (femaleControl && !femaleControl.value) {
      femaleControl.setValue(femaleName);
      femaleControl.markAsDirty();
    }
    if (pluralControl && !pluralControl.value) {
      pluralControl.setValue(pluralName);
      pluralControl.markAsDirty();
    }
  }

  private inflectWordFemale(word: string): string {
    const wordLower = word.toLowerCase();
    if (wordLower.endsWith('o')) {
      return word.slice(0, -1) + 'a';
    }
    if (wordLower.endsWith('or')) {
      return word + 'a'; // e.g. Director -> Directora, Auditor -> Auditora
    }
    if (wordLower.endsWith('efe')) {
      return word.slice(0, -1) + 'a'; // e.g. Jefe -> Jefa
    }
    if (wordLower.endsWith('ista') || wordLower.endsWith('nte') || wordLower.endsWith('al')) {
      return word; // e.g. Analista -> Analista, Asistente -> Asistente, Personal -> Personal
    }
    return word;
  }

  private inflectWordPlural(word: string): string {
    const wordLower = word.toLowerCase();
    if (wordLower.endsWith('o') || wordLower.endsWith('a') || wordLower.endsWith('e')) {
      return word + 's'; // e.g. Secretario -> Secretarios, Jefa -> Jefas, Jefe -> Jefes
    }
    if (wordLower.endsWith('or') || wordLower.endsWith('al')) {
      return word + 'es'; // e.g. Director -> Directores, Profesional -> Profesionales
    }
    return word + 's';
  }

  private inflectAdjectiveFemale(adj: string): string {
    const adjLower = adj.toLowerCase();
    if (adjLower.endsWith('o')) {
      return adj.slice(0, -1) + 'a'; // e.g. técnico -> técnica
    }
    return adj;
  }

  private inflectAdjectivePlural(adj: string): string {
    const adjLower = adj.toLowerCase();
    if (adjLower.endsWith('o') || adjLower.endsWith('a') || adjLower.endsWith('e')) {
      return adj + 's'; // e.g. técnico -> técnicos
    }
    if (adjLower.endsWith('al') || adjLower.endsWith('ar')) {
      return adj + 'es'; // e.g. particular -> particulares
    }
    return adj + 's';
  }

  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
        this.contextText.set(data.name || 'Detalles de puesto');
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
