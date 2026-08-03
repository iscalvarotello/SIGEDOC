import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule              } from '@angular/common';
import { BasePageController        } from '@baseclass/base-page.controller';
import { MasterWrapperComponent    } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent        } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent     } from '@system-shared/master-detail/detail-viewer.component';
import { FilterAreaComponent       } from '@system-shared/filters/filter-area.component';
import { ActionBarAction           } from '@system-shared/common/action-bar/action-bar.component';
import { ActionBarComponent        } from '@system-shared/common/action-bar/action-bar.component';
import { EmployeeService           } from '@rh/employees/employee.service';
import { AreaDTO                   } from './area.dto';
import { AreaService               } from './area.service';
import { AREA_PAGE_CONFIG          } from './area-page.config';
import { AreaScheduleFormComponent } from './components/area-schedule-form.component';
import { AreaAuthFormComponent     } from './components/area-auth-form.component';

@Component({
  selector    : 'app-areas-page',
  standalone  : true,
  imports     : [ CommonModule, MasterWrapperComponent, DataTableComponent, DetailViewerComponent, FilterAreaComponent,
                  ActionBarComponent, AreaScheduleFormComponent, AreaAuthFormComponent ] ,
  templateUrl : './areas-page.component.html'
})
export class AreasPageComponent extends BasePageController<AreaDTO> {
  protected apiService = inject(AreaService);
  public pageConfig = AREA_PAGE_CONFIG;
  private employeeService = inject(EmployeeService);

  // Estados de vista de configuración
  currentFormView = signal<'list' | 'schedule' | 'auth'>('list');
  configuringArea = signal<AreaDTO | null>(null);
  isSaving = signal<boolean>(false);

  // Estados para autorizaciones
  employees = signal<any[]>([]);
  isLoadingEmployees = signal<boolean>(false);

  areaActions = computed<ActionBarAction[]>(() => {
    return [
      {
        id: 'reception_schedule',
        name: 'Horarios de recepción',
        subtitle: 'Días y horas de entrega',
        iconName: 'Engrane',
        colorClass: 'hover:border-theme-primary',
        iconColorClass: 'bg-theme-primary/10 text-theme-primary'
      },
      {
        id: 'authorizations',
        name: 'Autorizaciones',
        subtitle: 'Configurar firmante VoBo',
        iconName: 'Escudo',
        colorClass: 'hover:border-theme-secondary',
        iconColorClass: 'bg-theme-secondary/10 text-theme-secondary'
      }
    ];
  });

  handleAreaAction(action: ActionBarAction) {
    const area = this.selectedItem();
    if (!area) return;

    if (action.id === 'reception_schedule') {
      this.configuringArea.set(area);
      this.currentFormView.set('schedule');
    } else if (action.id === 'authorizations') {
      this.configuringArea.set(area);
      this.loadEmployees();
      this.currentFormView.set('auth');
    }
  }

  closeFormView() {
    this.currentFormView.set('list');
    this.configuringArea.set(null);
  }

  async saveSchedule(schedule: Record<string, any>) {
    const area = this.configuringArea();
    if (!area) return;

    this.isSaving.set(true);
    try {
      const cleanedSchedule: Record<string, any> = {};
      for (const day of Object.keys(schedule)) {
        cleanedSchedule[day] = {
          recepcion: schedule[day].recepcion,
          hora_inicio: schedule[day].recepcion ? (schedule[day].hora_inicio || '09:00') : null,
          hora_fin: schedule[day].recepcion ? (schedule[day].hora_fin || '16:00') : null
        };
      }

      await this.apiService.update(area.id, { reception_schedule: cleanedSchedule }, this.pageConfig.cacheConfig?.key);
      alert('Horarios de recepción guardados correctamente.');

      // Actualizar localmente
      area.reception_schedule = cleanedSchedule;
      this.selectedItem.set(new AreaDTO(area));
      await this.refresh();
      this.closeFormView();
    } catch (err: any) {
      console.error('Error al guardar horarios:', err);
      alert('Error al guardar los horarios:\n' + (err?.error?.message || err?.message));
    } finally {
      this.isSaving.set(false);
    }
  }

  async loadEmployees(forceRefresh = false) {
    this.isLoadingEmployees.set(true);
    try {
      const res = await this.employeeService.getAll(undefined, undefined, forceRefresh);
      this.employees.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar catálogo de empleados:', err);
    } finally {
      this.isLoadingEmployees.set(false);
    }
  }

  async saveAuth(employeeId: string | null) {
    const area = this.configuringArea();
    if (!area) return;

    this.isSaving.set(true);
    try {
      await this.apiService.update(area.id, { vobo_incidencia_id: employeeId }, this.pageConfig.cacheConfig?.key);
      alert('Visto Bueno de incidencias configurado correctamente.');

      // Actualizar localmente
      area.vobo_incidencia_id = employeeId;
      this.selectedItem.set(new AreaDTO(area));
      await this.refresh();
      this.closeFormView();
    } catch (err: any) {
      console.error('Error al guardar VoBo:', err);
      alert('Error al guardar la autorización:\n' + (err?.error?.message || err?.message));
    } finally {
      this.isSaving.set(false);
    }
  }
override async loadData(forceRefresh = false, urlParams?: any, queryParams?: any) {
    this.isLoading.set(true);
    
    if (urlParams !== undefined) this.activeUrlParams = urlParams;
    if (queryParams !== undefined) this.activeQueryParams = queryParams;

    try {
      let response: any;
      // Si hay un ID en los urlParams (que significa que hay un parentId seleccionado)
      if (this.activeUrlParams && this.activeUrlParams.id) {
         response = await this.apiService.executeSpecialRoute(
           'getTree', 
           { id: this.activeUrlParams.id }, 
           undefined, 
           this.activeQueryParams, 
           this.pageConfig.cacheConfig, 
           forceRefresh
         );
      } else {
         response = await this.apiService.getAll(this.activeQueryParams, this.pageConfig.cacheConfig, forceRefresh);
      }
      
      let data = response.data || response || [];
      // Si el backend devolvió un único objeto jerárquico en lugar de un arreglo, lo aplanamos manualmente
      if (data && !Array.isArray(data)) {
        data = this.flattenTree(data);
      }
      
      this.rawData.set(data);
    } catch (error) {
      console.error('Error cargando la lista:', error);
      this.rawData.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Utilidad para aplanar un árbol en caso de que el backend no respete el plain=true
  private flattenTree(node: any): any[] {
    if (!node) return [];
    const children = node.children || [];
    
    // Asegurar que el nodo actual sea un DTO
    const isDto = typeof node.full_name !== 'undefined';
    const dtoNode = isDto ? node : new AreaDTO(node);
    
    // Crear copia limpia para la tabla
    const nodeCopy = Object.assign(new AreaDTO({}), dtoNode);
    delete (nodeCopy as any).children; 
    
    let flat = [nodeCopy];
    for (const child of children) {
      flat = flat.concat(this.flattenTree(child));
    }
    return flat;
  }

  onParentAreaChanged(event: { parentId: string }) {
    if (event.parentId) {
      // Mandamos el parentId como { id: event.parentId } a los urlParams para que getTree reemplace el :id
      this.loadData(false, { id: event.parentId }, undefined);
    } else {
      // Si no hay nada seleccionado, limpiamos urlParams
      this.loadData(false, {}, undefined);
    }
  }
}
