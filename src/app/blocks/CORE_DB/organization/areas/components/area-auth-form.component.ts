import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSelectComponent } from '../../../../../shared/components/common/employee-select/employee-select.component';
import { AreaDTO } from '../area.dto';

@Component({
  selector: 'app-area-auth-form',
  standalone: true,
  imports: [CommonModule, EmployeeSelectComponent],
  templateUrl: './area-auth-form.component.html'
})
export class AreaAuthFormComponent implements OnInit, OnChanges {
  @Input() area!: AreaDTO;
  @Input() isSaving: boolean = false;
  @Input() employees: any[] = [];
  @Input() isLoadingEmployees: boolean = false;

  @Output() onSave = new EventEmitter<string | null>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onReloadEmployees = new EventEmitter<void>();

  voboEmployeeId: string = '';
  selectedVoboEmployee: any | null = null;

  ngOnInit() {
    this.voboEmployeeId = this.area.vobo_incidencia_id || '';
    this.resolveVoboEmployee();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employees']) {
      this.resolveVoboEmployee();
    }
  }

  resolveVoboEmployee() {
    if (this.voboEmployeeId && this.employees.length > 0) {
      const emp = this.employees.find(e => 
        e.employee_id === this.voboEmployeeId || e.id_employee === this.voboEmployeeId || e.id === this.voboEmployeeId || e.id_empleado === this.voboEmployeeId
      );
      this.selectedVoboEmployee = emp || null;
    } else {
      this.selectedVoboEmployee = null;
    }
  }

  onVoboEmployeeSelect(emp: any) {
    if (emp) {
      this.voboEmployeeId = emp.employee_id || emp.id_employee || emp.id || emp.id_empleado;
      this.selectedVoboEmployee = emp;
    }
  }

  onVoboEmployeeClear() {
    this.voboEmployeeId = '';
    this.selectedVoboEmployee = null;
  }

  save() {
    this.onSave.emit(this.voboEmployeeId || null);
  }

  cancel() {
    this.onCancel.emit();
  }

  reloadEmployees() {
    this.onReloadEmployees.emit();
  }
}
