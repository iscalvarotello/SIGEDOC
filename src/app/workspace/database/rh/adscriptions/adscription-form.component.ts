import { Component, inject, signal, computed, input, output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdscriptionService } from './adscription.service';
import { AdscriptionDTO } from './adscription.dto';
import { GenericApiService } from '@app/core/services/generic-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { EmployeeSelectComponent } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { JobPositionSelectComponent } from '@workspace-shared/components/selects/job-position-select/job-position-select.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { SubmitButtonComponent } from '@system-shared/buttons/submit-button/submit-button.component';
import { DatePickerComponent } from '@system-shared/form/date-picker/date-picker.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-adscription-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    EmployeeSelectComponent, 
    JobPositionSelectComponent,
    CancelButtonComponent,
    SubmitButtonComponent,
    DatePickerComponent,
    IconComponent
  , ActionButtonComponent],
  templateUrl: './adscription-form.component.html'
})
export class AdscriptionFormComponent implements OnInit, OnChanges {
  isOpen = input<boolean>(false);
  selectedArea = input<any | null>(null);
  activeAction = input<string>('adscribir');
  editingAdscription = input<AdscriptionDTO | null>(null);
  titularAdscription = input<AdscriptionDTO | null>(null);

  onClose = output<void>();
  onSaved = output<void>();

  private fb = inject(FormBuilder);
  private adscriptionService = inject(AdscriptionService);
  private genericService = inject(GenericApiService);

  // Listas de apoyo para los dropdowns
  employeesList = signal<any[]>([]);
  positionsList = signal<any[]>([]);
  areasList = signal<any[]>([]);
  activeAdscriptionsList = signal<any[]>([]);

  // ID del empleado seleccionado (Sincronizado desde el componente hijo)
  selectedEmployeeId = signal<string>('');

  // Estatus de Submit
  isFormSubmitting = signal<boolean>(false);

  // Advertencia de Doble Titularidad
  doubleTitularWarning = signal<string | null>(null);

  // Formulario
  form!: FormGroup;

  // Filtro de segmento computado a pre-seleccionar reactivamente
  positionFilterState = computed<'principal' | 'operativo' | 'todos'>(() => {
    const action = this.activeAction();
    const adsc = this.editingAdscription();

    if (action === 'editar' && adsc) {
      if (adsc.is_head) return 'principal';
      if (adsc.is_in_charge) return 'todos';
      return 'operativo';
    }

    if (action === 'asignar_titular' || action === 'cambiar_titular') {
      return 'principal';
    } else if (action === 'encargar') {
      return 'todos';
    } else if (action === 'adscribir' || action === 'transferir') {
      return 'operativo';
    }
    return 'todos';
  });

  // Etiquetas del Formulario Dinámicas
  drawerTitle = computed(() => {
    const action = this.activeAction();
    if (action === 'adscribir') return 'Adscribir Personal (Simple Mortal)';
    if (action === 'transferir') return 'Cambio de Adscripción (Traspaso)';
    if (action === 'asignar_titular') return 'Asignar Titular de Área';
    if (action === 'cambiar_titular') return 'Cambio de Titularidad';
    if (action === 'encargar') return 'Encargar Área (Encargo Temporal)';
    if (action === 'editar') return 'Editar Propiedades de Adscripción';
    return 'Movimiento de Personal';
  });

  employeeFieldLabel = computed(() => {
    const action = this.activeAction();
    if (action === 'transferir') return 'Seleccione Empleado a Transferir (desde otra área)';
    if (action === 'cambiar_titular') return 'Seleccione Nuevo Titular';
    if (action === 'encargar') return 'Seleccione Empleado que queda de Encargado';
    return 'Seleccione Empleado / Colaborador';
  });

  ngOnInit() {
    this.initForm();
    this.loadFormCatalogs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['isOpen'] && this.isOpen()) || (changes['editingAdscription'] && this.isOpen())) {
      this.initFormAndPreloads();
    }
  }

  private initForm() {
    this.form = this.fb.group({
      employee_id: ['', Validators.required],
      job_position_id: ['', Validators.required],
      area_id: [''],
      is_head: [false],
      is_in_charge: [false],
      is_reception: [false],
      is_reviewer: [false],
      start_date: [new Date().toISOString().substring(0, 10), Validators.required],
      end_date: [null],
      active: [true]
    });

    this.form.get('employee_id')?.valueChanges.subscribe(val => {
      this.selectedEmployeeId.set(val || '');

      if (!val) {
        this.doubleTitularWarning.set(null);
        return;
      }
      
      const action = this.activeAction();
      if (action === 'asignar_titular' || action === 'cambiar_titular') {
        const emp = this.employeesList().find(e => e.id_employee === val);
        if (emp && emp.is_head) {
          this.doubleTitularWarning.set(emp.area_name || 'otra área');
        } else {
          this.doubleTitularWarning.set(null);
        }
      } else {
        this.doubleTitularWarning.set(null);
      }
    });
  }

  private initFormAndPreloads() {
    this.doubleTitularWarning.set(null);
    this.isFormSubmitting.set(false);
    this.initForm();

    const adsc = this.editingAdscription();
    const action = this.activeAction();
    const area = this.selectedArea();

    if (action === 'editar' && adsc) {
      this.form.patchValue({
        employee_id: adsc.employee_id,
        job_position_id: adsc.job_position_id,
        area_id: adsc.area_id,
        is_head: adsc.is_head,
        is_in_charge: adsc.is_in_charge,
        is_reception: adsc.is_reception,
        is_reviewer: adsc.is_reviewer,
        start_date: adsc.start_date,
        end_date: adsc.end_date || null,
        active: adsc.active
      });
      this.form.get('employee_id')?.disable();
    } else {
      this.form.get('employee_id')?.enable();
      if (area) {
        this.form.get('area_id')?.setValue(area.id);
      }

      if (action === 'transferir') {
        this.loadActiveAdscriptions();
      }

      if (action === 'asignar_titular' || action === 'cambiar_titular') {
        this.form.patchValue({ is_head: true, is_in_charge: false });
      } else if (action === 'encargar') {
        this.form.patchValue({ is_in_charge: true, is_head: false });
      } else if (action === 'adscribir' || action === 'transferir') {
        this.form.patchValue({ is_head: false, is_in_charge: false });
      }
    }
  }

  // --- CARGA DE CATÁLOGOS ---

  async loadFormCatalogs() {
    try {
      const emps = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.EMPLOYEES);
      this.employeesList.set(emps || []);

      const posts = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.JOB_POSITIONS, { active: true });
      this.positionsList.set(posts || []);

      const areas = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.AREAS);
      this.areasList.set(areas || []);

      await this.loadActiveAdscriptions();
    } catch (e) {
      console.error('Error cargando catálogos de soporte:', e);
    }
  }

  async loadActiveAdscriptions() {
    try {
      const adscriptions = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.ADSCRIPTIONS, { active: true });
      this.activeAdscriptionsList.set(adscriptions || []);
    } catch (e) {
      console.error('Error cargando adscripciones activas generales:', e);
    }
  }

  // --- EVENTOS INTERFAZ DEL EMPLOYEE-SELECT ---

  onEmployeeSelect(emp: any) {
    const control = this.form.get('employee_id');
    if (control) {
      control.setValue(emp.id_employee);
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  onEmployeeClear() {
    const control = this.form.get('employee_id');
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  // --- EVENTOS INTERFAZ DEL JOB-POSITION-SELECT ---

  onPositionSelect(jp: any) {
    const control = this.form.get('job_position_id');
    if (control) {
      control.setValue(jp.id);
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  closeDrawer() {
    this.onClose.emit();
  }

  async onSubmit() {
    const area = this.selectedArea();
    if (this.form.invalid || !area) return;

    this.isFormSubmitting.set(true);

    if (this.doubleTitularWarning()) {
      const isOk = confirm(
        `Este empleado ya es titular en el área "${this.doubleTitularWarning()}". Al asignarlo le estás asignando doble titularidad, ¿Es esto lo que deseas hacer?`
      );
      if (!isOk) {
        this.isFormSubmitting.set(false);
        return;
      }
    }

    const action = this.activeAction();
    const rawVal = this.form.getRawValue();

    try {
      if (action === 'editar' && this.editingAdscription()) {
        const adscId = this.editingAdscription()!.id;
        await this.adscriptionService.update(adscId, {
          ...rawVal,
          area_id: rawVal.area_id || area.id,
          area_base_id: rawVal.area_id || area.id
        });

      } else if (action === 'transferir') {
        const employeeId = rawVal.employee_id;
        const targetAreaId = rawVal.area_id || area.id;
        
        const payload = {
          area_id: targetAreaId,
          area_base_id: targetAreaId,
          job_position_id: rawVal.job_position_id,
          is_head: false,
          is_in_charge: false,
          is_reception: rawVal.is_reception,
          is_reviewer: rawVal.is_reviewer,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: rawVal.active
        };

        const activeAdsc = this.activeAdscriptionsList().find(a => a.employee_id === employeeId);

        if (activeAdsc) {
          await this.adscriptionService.transfer(activeAdsc.id, payload);
        } else {
          await this.adscriptionService.create({
            ...payload,
            employee_id: employeeId
          });
        }

      } else if (action === 'cambiar_titular') {
        if (!this.titularAdscription()) {
          throw new Error('No hay un titular vigente asignado para transferir en esta área.');
        }
        
        const currentTitularAdscId = this.titularAdscription()!.id;
        const targetAreaId = rawVal.area_id || area.id;

        const payload = {
          area_id: targetAreaId,
          area_base_id: targetAreaId,
          job_position_id: rawVal.job_position_id,
          is_head: true,
          is_in_charge: false,
          is_reception: false,
          is_reviewer: false,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: rawVal.active
        };

        await this.adscriptionService.transfer(currentTitularAdscId, payload);

        const newTitularPayload = {
          employee_id: rawVal.employee_id,
          area_id: area.id,
          area_base_id: area.id,
          job_position_id: rawVal.job_position_id,
          is_head: true,
          is_in_charge: false,
          start_date: rawVal.start_date,
          active: true
        };
        await this.adscriptionService.create(newTitularPayload);

      } else {
        const payload = {
          ...rawVal,
          area_id: area.id,
          area_base_id: area.id
        };
        await this.adscriptionService.create(payload);
      }
      
      this.onSaved.emit();
    } catch (e: any) {
      console.error('Error procesando el formulario:', e);
      alert('Hubo un problema al guardar:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
      this.isFormSubmitting.set(false);
    }
  }
}
