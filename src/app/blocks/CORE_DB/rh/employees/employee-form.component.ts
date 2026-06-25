import { Component, inject, signal, computed, input, output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from './employee.dto';
import { AdscriptionService } from '../adscriptions/adscription.service';
import { GenericApiService } from '@app/core/services/generic-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { EmployeeSelectComponent } from '../../../../shared/components/common/employee-select/employee-select.component';
import { JobPositionSelectComponent } from '../../../../shared/components/common/job-position-select/job-position-select.component';
import { CancelButtonComponent } from '../../../../shared/components/common/cancel-button/cancel-button.component';
import { SubmitButtonComponent } from '../../../../shared/components/common/submit-button/submit-button.component';
import { PersonService } from '../persons/person.service';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    EmployeeSelectComponent, 
    JobPositionSelectComponent,
    CancelButtonComponent,
    SubmitButtonComponent,
    DatePickerComponent
  ],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  isOpen = input<boolean>(false);
  selectedArea = input<any | null>(null);
  activeAction = input<'nuevo' | 'traspaso' | 'editar' | 'nueva_adscripcion'>('nuevo');
  selectedEmployee = input<EmployeeDTO | null>(null);

  onClose = output<void>();
  onSaved = output<void>();

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private adscriptionService = inject(AdscriptionService);
  private genericService = inject(GenericApiService);
  private personService = inject(PersonService);

  personsList = signal<any[]>([]);
  mappedPersonsList = signal<any[]>([]);
  positionsList = signal<any[]>([]);
  areasList = signal<any[]>([]);

  isFormSubmitting = signal<boolean>(false);
  form!: FormGroup;

  drawerTitle = computed(() => {
    const action = this.activeAction();
    if (action === 'nuevo') return 'Registrar y Adscribir Nuevo Empleado';
    if (action === 'traspaso') return 'Cambio de Adscripción (Traspaso)';
    if (action === 'nueva_adscripcion') return 'Asignar Nueva Adscripción al Empleado';
    return 'Editar Empleado y Control Horario';
  });

  ngOnInit() {
    this.initForm();
    this.loadFormCatalogs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['isOpen'] && this.isOpen()) || (changes['selectedEmployee'] && this.isOpen()) || (changes['activeAction'] && this.isOpen())) {
      this.initFormAndPreloads();
      this.loadFormCatalogs();
    }
  }

  private initForm() {
    this.form = this.fb.group({
      person_id: ['', Validators.required],
      job_position_id: ['', Validators.required],
      area_id: [''],
      area_base_id: ['', Validators.required],
      ref_doc: [''],
      check_number: [''],
      check_in_hour: [''],
      check_out_hour: [''],
      is_reception: [false],
      is_reviewer: [false],
      start_date: [new Date().toISOString().substring(0, 10), Validators.required],
      end_date: [null],
      active: [true]
    });
  }

  private initFormAndPreloads() {
    this.isFormSubmitting.set(false);
    this.initForm();

    const emp = this.selectedEmployee();
    const action = this.activeAction();
    const area = this.selectedArea();

    if (action === 'editar' && emp) {
      this.form.patchValue({
        person_id: emp.employee_id, // valor dummy para validación
        job_position_id: emp.job_position_id,
        area_id: emp.area_id,
        area_base_id: emp.area_base_id || emp.area_id || '',
        ref_doc: emp.ref_doc || '',
        check_number: emp.check_number || '',
        check_in_hour: emp.check_in_hour || '',
        check_out_hour: emp.check_out_hour || '',
        is_reception: emp.is_reception,
        is_reviewer: emp.is_reviewer,
        start_date: emp.start_date,
        end_date: emp.end_date || null,
        active: emp.active
      });
      this.form.get('person_id')?.disable();
    } else {
      this.form.get('person_id')?.enable();
      if (area) {
        this.form.get('area_id')?.setValue(area.id);
        this.form.get('area_base_id')?.setValue(area.id);
      }
      
      if (action === 'traspaso' && emp) {
        this.form.patchValue({
          person_id: emp.employee_id,
          job_position_id: emp.job_position_id,
          area_base_id: emp.area_base_id || emp.area_id || (area ? area.id : ''),
          is_reception: emp.is_reception,
          is_reviewer: emp.is_reviewer,
          start_date: new Date().toISOString().substring(0, 10)
        });
        this.form.get('person_id')?.disable();
      }

      if (action === 'nueva_adscripcion' && emp) {
        this.form.patchValue({
          person_id: emp.employee_id,
          job_position_id: '',
          area_id: area ? area.id : '',
          area_base_id: emp.area_base_id || emp.area_id || (area ? area.id : ''),
          is_reception: false,
          is_reviewer: false,
          start_date: new Date().toISOString().substring(0, 10)
        });
        this.form.get('person_id')?.disable();
      }
    }
  }

  async loadFormCatalogs() {
    try {
      // 1. Obtener personas desocupadas para alta nueva, o todas para el resto de acciones
      let persons: any[];
      if (this.activeAction() === 'nuevo') {
        persons = await this.personService.getUnemployed();
      } else {
        persons = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.PERSONS);
      }
      this.personsList.set(persons || []);
      
      // Mapeamos personas para que EmployeeSelectComponent las maneje transparentemente
      const mapped = (persons || []).map(p => ({
        id_employee: p.id,
        id: p.id,
        name: p.name,
        first_surname: p.first_surname,
        second_surname: p.second_surname,
        rfc: p.rfc,
        job_name: 'Persona registrada',
        area_name: ''
      }));
      this.mappedPersonsList.set(mapped);

      // 2. Obtener puestos de trabajo activos
      const posts = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.JOB_POSITIONS, { active: true });
      this.positionsList.set(posts || []);

      // 3. Obtener áreas administrativas
      const areas = await this.genericService.getDropdownOptions(ENDPOINT_KEYS.AREAS);
      this.areasList.set(areas || []);
    } catch (e) {
      console.error('Error cargando catálogos del formulario de empleado:', e);
    }
  }

  onPersonSelect(person: any) {
    const control = this.form.get('person_id');
    if (control) {
      control.setValue(person.id_employee);
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  onPersonClear() {
    const control = this.form.get('person_id');
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.markAsTouched();
    }
  }

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
    const action = this.activeAction();
    const rawVal = this.form.getRawValue();

    try {
      if (action === 'nuevo') {
        // PASO 1: Crear el empleado en el Backend (Tabla de Empleados)
        const employeePayload = {
          person: rawVal.person_id,
          ref_doc: rawVal.ref_doc || null,
          check_in_number: rawVal.check_number || null,
          check_in_hour: rawVal.check_in_hour || null,
          check_out_hour: rawVal.check_out_hour || null,
          active: true
        };

        const createdEmployee = await this.employeeService.create(employeePayload);

        // PASO 2: Adscribir al empleado creado al área correspondiente
        const adscriptionPayload = {
          employee_id: createdEmployee.id, // UUID del empleado creado
          area_id: area.id,
          area_base_id: rawVal.area_base_id || area.id,
          job_position_id: rawVal.job_position_id,
          is_head: false,
          is_in_charge: false,
          is_reception: rawVal.is_reception,
          is_reviewer: rawVal.is_reviewer,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: true
        };

        await this.adscriptionService.create(adscriptionPayload);

      } else if (action === 'nueva_adscripcion' && this.selectedEmployee()) {
        const emp = this.selectedEmployee()!;
        const targetAreaId = rawVal.area_id || area.id;
        
        // Registrar solo adscripción para el empleado existente
        const adscriptionPayload = {
          employee_id: emp.employee_id,
          area_id: targetAreaId,
          area_base_id: rawVal.area_base_id || targetAreaId,
          job_position_id: rawVal.job_position_id,
          is_head: false,
          is_in_charge: false,
          is_reception: rawVal.is_reception,
          is_reviewer: rawVal.is_reviewer,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: true
        };

        await this.adscriptionService.create(adscriptionPayload);

      } else if (action === 'traspaso' && this.selectedEmployee()) {
        // CAMBIO DE ADSCRIPCIÓN (TRASPASO DE ÁREA/PUESTO)
        const activeAdscId = this.selectedEmployee()!.id;
        const targetAreaId = rawVal.area_id || area.id;

        const transferPayload = {
          area_id: targetAreaId,
          area_base_id: rawVal.area_base_id || targetAreaId,
          job_position_id: rawVal.job_position_id,
          is_head: false,
          is_in_charge: false,
          is_reception: rawVal.is_reception,
          is_reviewer: rawVal.is_reviewer,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: true
        };

        await this.adscriptionService.transfer(activeAdscId, transferPayload);

      } else if (action === 'editar' && this.selectedEmployee()) {
        // EDICIÓN DE PROPIEDADES DE EMPLEADO Y SU ADSCRIPCIÓN VIGENTE
        const emp = this.selectedEmployee()!;
        
        // 1. Actualizar el Empleado
        const employeePayload = {
          ref_doc: rawVal.ref_doc || null,
          check_in_number: rawVal.check_number || null,
          check_in_hour: rawVal.check_in_hour || null,
          check_out_hour: rawVal.check_out_hour || null,
          active: rawVal.active
        };
        await this.employeeService.update(emp.employee_id, employeePayload);

        // 2. Actualizar la Adscripción
        const adscriptionPayload = {
          area_base_id: rawVal.area_base_id,
          job_position_id: rawVal.job_position_id,
          is_reception: rawVal.is_reception,
          is_reviewer: rawVal.is_reviewer,
          start_date: rawVal.start_date,
          end_date: rawVal.end_date || null,
          active: rawVal.active
        };
        await this.adscriptionService.update(emp.id, adscriptionPayload);
      }

      this.onSaved.emit();
    } catch (e: any) {
      console.error('Error guardando empleado:', e);
      alert('Hubo un error al procesar el registro:\n' + (e?.error?.message || e?.message || 'Error desconocido'));
    } finally {
      this.isFormSubmitting.set(false);
    }
  }
}
