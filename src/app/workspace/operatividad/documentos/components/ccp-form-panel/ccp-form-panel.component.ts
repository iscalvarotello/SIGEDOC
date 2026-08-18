import { Component, model, signal, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CCP_PHRASES } from '@core/config/app.ccp-phrases.config';
import { AreaSelectComponent } from '@workspace-shared/components/selects/area-select/area-select.component';
import { EmployeeSelectComponent } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { EmployeeService } from '@rh/employees/employee.service';

@Component({
  selector: 'app-ccp-form-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AreaSelectComponent,
    EmployeeSelectComponent,
    ActionButtonComponent,
    IconComponent
  ],
  templateUrl: './ccp-form-panel.component.html'
})
export class CcpFormPanelComponent {
  // Input/Output model for two-way binding
  ccps = model<any[]>([]); // { id_area: string, id_empleado: string, area_name: string, employee_name: string, motivo: string }[]

  // Optional: All areas from parent (if needed for name lookup)
  allAreas = input<any[]>([]);

  private _employeeService = inject(EmployeeService);

  // Local state for the selectors
  ccpAreaId = signal<string>('');
  ccpEmployeeId = signal<string>('');
  ccpEmployeesList = signal<any[]>([]);
  isCcpEmployeesLoading = signal<boolean>(false);
  
  ccpPhrases = CCP_PHRASES;
  selectedCcpPhrase = signal<string>('Para su conocimiento');
  customCcpPhrase = signal<string>('');

  async onCcpAreaChange(area: any, forceRefresh = false) {
    const areaId = typeof area === 'string' ? area : (area?.id || '');
    this.ccpAreaId.set(areaId);
    this.ccpEmployeeId.set('');
    if (!areaId) {
      this.ccpEmployeesList.set([]);
      return;
    }
    this.isCcpEmployeesLoading.set(true);
    try {
      const res = await this._employeeService.getByArea(areaId, forceRefresh);
      this.ccpEmployeesList.set(res.data || []);
      if (res.data && res.data.length > 0) {
        this.ccpEmployeeId.set(res.data[0].employee_id);
      }
    } catch (err) {
      console.error('Error cargando lista de empleados para CCP:', err);
    } finally {
      this.isCcpEmployeesLoading.set(false);
    }
  }

  onCcpEmployeeSelect(emp: any) {
    if (emp) {
      this.ccpEmployeeId.set(emp.employee_id || emp.id_employee || '');
    }
  }

  onCcpEmployeeClear() {
    this.ccpEmployeeId.set('');
  }

  onCcpPhraseChange(val: string) {
    this.selectedCcpPhrase.set(val);
    if (val !== 'Otro') {
      this.customCcpPhrase.set('');
    }
  }

  addCcp() {
    if (!this.ccpAreaId() || !this.ccpEmployeeId()) return;

    // Use allAreas() if provided, otherwise fallback to "Área"
    const area = this.allAreas().find(a => a.id === this.ccpAreaId());
    const emp = this.ccpEmployeesList().find(e => e.employee_id === this.ccpEmployeeId());

    if (emp) {
      const motivoText = this.selectedCcpPhrase() === 'Otro' ? this.customCcpPhrase().trim() : this.selectedCcpPhrase();
      const item = {
        id_area: this.ccpAreaId(),
        id_empleado: this.ccpEmployeeId(),
        area_name: area ? (area.acronym || area.name) : 'Área',
        employee_name: emp.fullName,
        motivo: motivoText || 'Para su conocimiento'
      };

      if (!this.ccps().some(c => c.id_empleado === item.id_empleado)) {
        this.ccps.update(list => [...list, item]);
      }

      // Reset
      this.ccpEmployeeId.set('');
      this.ccpEmployeesList.set([]);
      this.ccpAreaId.set('');
      this.selectedCcpPhrase.set('Para su conocimiento');
      this.customCcpPhrase.set('');
    }
  }

  removeCcp(employeeId: string) {
    this.ccps.update(list => list.filter(c => c.id_empleado !== employeeId));
  }
}
