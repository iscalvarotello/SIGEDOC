import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from './employee.dto';
import { AdscriptionService } from '../adscriptions/adscription.service';
import { GenericApiService } from '@app/core/services/generic-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';

import { ActionBarAction } from '@system-shared/common/action-bar/action-bar.component';
import { ActionBarComponent } from '@system-shared/common/action-bar/action-bar.component';
import { DismissAreacardComponent } from '@workspace-shared/components/common/dismiss-areacard/dismiss-areacard.component';
import { AreaHeaderComponent } from '@workspace-shared/components/common/area-header/area-header.component';
import { CardListComponent } from '@system-shared/common/card-list/card-list.component';
import { EmployeeCardComponent } from '@workspace-shared/components/common/employee-card/employee-card.component';
import { EmployeeDetailComponent } from '@workspace-shared/components/common/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './employee-form.component';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralBubbleComponent } from '@system-shared/ui/general-bubble/general-bubble.component';
import { getEmployeeActionsConfig } from './employee.setting';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { TitleComponent } from '@system-shared/ui/title/title.component';

@Component({
  selector: 'app-employees-panel',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    DismissAreacardComponent,
    AreaHeaderComponent,
    CardListComponent,
    EmployeeCardComponent,
    EmployeeDetailComponent,
    EmployeeFormComponent,
    ModalComponent,
    IconComponent,
    ActionButtonComponent,
    GeneralBubbleComponent,
    TitleComponent
  ],
  templateUrl: './employees-panel.component.html'
})
export class EmployeesPanelComponent {
  selectedArea = input<any | null>(null);

  private employeeService = inject(EmployeeService);
  private adscriptionService = inject(AdscriptionService);
  private genericService = inject(GenericApiService);

  isLoading = signal<boolean>(false);
  employeesList = signal<EmployeeDTO[]>([]);
  selectedEmployee = signal<EmployeeDTO | null>(null);

  isDrawerOpen = signal<boolean>(false);
  activeAction = signal<'nuevo' | 'traspaso' | 'editar' | 'nueva_adscripcion'>('nuevo');

  // Control de reactivación y lista negra
  isReactivateModalOpen = signal<boolean>(false);
  deadEmployees = signal<EmployeeDTO[]>([]);
  isLoadingDeadlist = signal<boolean>(false);
  deadlistSearchText = signal<string>('');

  filteredDeadEmployees = computed(() => {
    const query = this.deadlistSearchText().toLowerCase().trim();
    const list = this.deadEmployees();
    if (!query) return list;
    return list.filter(emp => 
      emp.fullName.toLowerCase().includes(query) || 
      (emp.rfc && emp.rfc.toLowerCase().includes(query)) ||
      (emp.curp && emp.curp.toLowerCase().includes(query))
    );
  });

  canOperateOnEmployee = computed(() => {
    return this.selectedEmployee() !== null;
  });

  actionsConfig = computed<ActionBarAction[]>(() => {
    return getEmployeeActionsConfig(this.canOperateOnEmployee());
  });

  constructor() {
    effect(() => {
      const area = this.selectedArea();
      if (area && area.id) {
        this.loadEmployees(area.id);
        this.selectedEmployee.set(null);
      } else {
        this.employeesList.set([]);
        this.selectedEmployee.set(null);
      }
    });
  }

  async loadEmployees(areaId: string) {
    this.isLoading.set(true);
    try {
      const res = await this.employeeService.getByArea(areaId, true);
      const list = res.data || [];
      this.employeesList.set(list);
      
      // Sincronizar el empleado seleccionado con su nueva versión en el listado
      const currentSelected = this.selectedEmployee();
      if (currentSelected) {
        const updated = list.find(e => e.id === currentSelected.id);
        if (updated) {
          this.selectedEmployee.set(updated);
        } else {
          this.selectedEmployee.set(null);
        }
      }
    } catch (e) {
      console.error('Error cargando empleados del área:', e);
      this.employeesList.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onEmployeeCardClick(emp: EmployeeDTO) {
    this.selectedEmployee.set(emp);
  }

  openActionDrawer(action: 'nuevo' | 'traspaso' | 'editar' | 'nueva_adscripcion') {
    this.activeAction.set(action);
    if (action === 'nuevo') {
      this.selectedEmployee.set(null);
    }
    this.isDrawerOpen.set(true);
  }

  openEditEmployeeDrawer(emp: EmployeeDTO) {
    this.selectedEmployee.set(emp);
    this.openActionDrawer('editar');
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  onFormSaved() {
    const area = this.selectedArea();
    if (area) {
      this.loadEmployees(area.id);
    }
    this.closeDrawer();
  }

  handleActionBarClick(action: ActionBarAction) {
    if (action.id === 'baja') {
      const emp = this.selectedEmployee();
      if (emp) this.deleteEmployee(emp);
    } else if (action.id === 'reactivar') {
      this.openReactivateModal();
    } else {
      this.openActionDrawer(action.id as any);
    }
  }

  async openReactivateModal() {
    this.deadlistSearchText.set('');
    this.isLoadingDeadlist.set(true);
    this.isReactivateModalOpen.set(true);
    try {
      const res = await this.employeeService.getDeadlist(true);
      this.deadEmployees.set(res.data || []);
    } catch (e) {
      console.error('Error cargando lista negra:', e);
      this.deadEmployees.set([]);
    } finally {
      this.isLoadingDeadlist.set(false);
    }
  }

  closeReactivateModal() {
    this.isReactivateModalOpen.set(false);
  }

  async reactivateEmployee(emp: EmployeeDTO) {
    if (confirm(`⚠️ ¿Estás seguro de reactivar a ${emp.fullName}?\nEl colaborador volverá a estar activo en el catálogo general.`)) {
      try {
        await this.employeeService.update(emp.employee_id, { active: true });
        this.closeReactivateModal();
        
        // Cargar al empleado seleccionado para asignarle su nueva adscripción en el drawer
        this.selectedEmployee.set(emp);
        this.openActionDrawer('nueva_adscripcion');
        
        alert(`¡Empleado ${emp.fullName} reactivado!\nA continuación, asigne su nueva área base, puesto y adscripción.`);
      } catch (e: any) {
        console.error('Error reactivando empleado:', e);
        alert('No se pudo reactivar al empleado:\n' + (e?.error?.message || e?.message));
      }
    }
  }

  async deleteEmployee(emp: EmployeeDTO) {
    const area = this.selectedArea();
    if (!area) return;

    if (confirm(`⚠️ ¿Estás seguro de dar de baja total a ${emp.fullName}?\nSe desactivará el empleado y todas sus adscripciones de forma definitiva en el sistema.`)) {
      try {
        await this.employeeService.dismiss(emp.employee_id);
        await this.loadEmployees(area.id);
        this.selectedEmployee.set(null);

        this.genericService.clearCache(`${ENDPOINT_KEYS.EMPLOYEES}_by_area_${area.id}`);
        this.genericService.clearCache(`${ENDPOINT_KEYS.ADSCRIPTIONS}_by_area_${area.id}`);
        this.genericService.clearCache(ENDPOINT_KEYS.EMPLOYEES);
      } catch (e: any) {
        console.error('Error al dar de baja total al empleado:', e);
        alert('No se pudo procesar la baja total:\n' + (e?.error?.message || e?.message));
      }
    }
  }
}
