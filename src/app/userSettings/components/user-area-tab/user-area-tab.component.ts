import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSelectComponent } from '@components/common/employee-select/employee-select.component';
import { TimePickerComponent } from '@components/form/time-picker/time-picker.component';
import { SesionService } from '@shared/services/sesion.service';
import { AreaService } from '@core_db/organization/areas/area.service';
import { EmployeeService } from '@core_db/rh/employees/employee.service';

@Component({
  selector: 'app-user-area-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeSelectComponent,
    TimePickerComponent
  ],
  templateUrl: './user-area-tab.component.html'
})
export class UserAreaTabComponent implements OnInit {
  public sesionService = inject(SesionService);
  private areaService = inject(AreaService);
  private employeeService = inject(EmployeeService);

  activeAreaId = computed(() => this.sesionService.activeAdscription()?.id_area || '');
  activeAreaName = computed(() => this.sesionService.activeAdscription()?.nombre_area || '');
  
  areaData = signal<any | null>(null);
  isLoadingArea = signal<boolean>(false);
  isSavingArea = signal<boolean>(false);

  voboEmployeeId = '';
  selectedVoboEmployee: any | null = null;
  employeesCatalog = signal<any[]>([]);
  isLoadingEmployees = signal<boolean>(false);

  scheduleData: Record<string, any> = {};
  daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  ngOnInit() {
    this.loadAreaDetails();
    this.loadEmployeesCatalog();
  }

  async loadAreaDetails() {
    const areaId = this.activeAreaId();
    if (!areaId) return;

    this.isLoadingArea.set(true);
    try {
      const area = await this.areaService.getById(areaId);
      this.areaData.set(area);
      this.initSchedule(area.reception_schedule);
      this.voboEmployeeId = area.vobo_incidencia_id || '';
    } catch (err) {
      console.error('Error al cargar detalles del área:', err);
    } finally {
      this.isLoadingArea.set(false);
    }
  }

  async loadEmployeesCatalog(forceRefresh = false) {
    if (this.employeesCatalog().length > 0 && !forceRefresh) return;

    this.isLoadingEmployees.set(true);
    try {
      const res = await this.employeeService.getAll(undefined, undefined, forceRefresh);
      this.employeesCatalog.set(res.data || []);
      this.resolveVoboEmployee();
    } catch (err) {
      console.error('Error al cargar catálogo de empleados:', err);
    } finally {
      this.isLoadingEmployees.set(false);
    }
  }

  resolveVoboEmployee() {
    if (this.voboEmployeeId && this.employeesCatalog().length > 0) {
      const emp = this.employeesCatalog().find(e => 
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

  initSchedule(receptionSchedule: any) {
    const defaultSchedule: Record<string, any> = {
      lunes:     { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      martes:    { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      miercoles: { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      jueves:    { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      viernes:   { recepcion: true,  hora_inicio: '09:00', hora_fin: '16:00' },
      sabado:    { recepcion: false, hora_inicio: '09:00', hora_fin: '16:00' },
      domingo:   { recepcion: false, hora_inicio: '09:00', hora_fin: '16:00' }
    };
    
    const schedule: Record<string, any> = {};
    const reception = receptionSchedule || {};
    
    for (const day of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']) {
      const item = reception[day] || defaultSchedule[day];
      schedule[day] = {
        recepcion: item.recepcion !== undefined ? item.recepcion : false,
        hora_inicio: item.recepcion ? (item.hora_inicio || '09:00') : '',
        hora_fin: item.recepcion ? (item.hora_fin || '16:00') : ''
      };
    }
    
    this.scheduleData = schedule;
  }

  onScheduleToggle(dayKey: string) {
    if (!this.scheduleData[dayKey].recepcion) {
      this.scheduleData[dayKey].hora_inicio = '';
      this.scheduleData[dayKey].hora_fin = '';
    } else {
      this.scheduleData[dayKey].hora_inicio = '09:00';
      this.scheduleData[dayKey].hora_fin = '16:00';
    }
  }

  async saveAreaConfig() {
    const areaId = this.activeAreaId();
    if (!areaId) return;

    this.isSavingArea.set(true);
    try {
      const cleanedSchedule: Record<string, any> = {};
      for (const day of Object.keys(this.scheduleData)) {
        cleanedSchedule[day] = {
          recepcion: this.scheduleData[day].recepcion,
          hora_inicio: this.scheduleData[day].recepcion ? (this.scheduleData[day].hora_inicio || '09:00') : null,
          hora_fin: this.scheduleData[day].recepcion ? (this.scheduleData[day].hora_fin || '16:00') : null
        };
      }

      await this.areaService.update(areaId, {
        reception_schedule: cleanedSchedule,
        vobo_incidencia_id: this.voboEmployeeId || null
      });

      alert('Configuración de su área guardada correctamente.');
      
      if (this.areaData()) {
        const updated = {
          ...this.areaData(),
          reception_schedule: cleanedSchedule,
          vobo_incidencia_id: this.voboEmployeeId || null
        };
        this.areaData.set(updated);
      }
    } catch (err: any) {
      console.error('Error al guardar configuración del área:', err);
      alert('Error al guardar la configuración:\n' + (err?.error?.message || err?.message));
    } finally {
      this.isSavingArea.set(false);
    }
  }
}
