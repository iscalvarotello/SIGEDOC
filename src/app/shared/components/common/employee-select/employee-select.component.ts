import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '../../../icons/svg-icons';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

@Component({
  selector: 'app-employee-select',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="relative w-full flex items-center gap-1.5" [class.z-50]="isEmployeeDropdownOpen()">
      
      <!-- Contenedor del Input y Dropdown -->
      <div class="flex-1 relative">
        <!-- Overlay transparente para cerrar al hacer clic afuera -->
        @if (isEmployeeDropdownOpen() && !disabled()) {
          <div class="fixed inset-0 z-40" (click)="closeEmployeeDropdown()"></div>
        }

        <!-- Caja de entrada y trigger -->
        <div class="relative flex items-center" [class.z-50]="isEmployeeDropdownOpen()">
          <input 
            type="text"
            [value]="isEmployeeDropdownOpen() ? employeeSearchQuery() : selectedEmployeeLabel()"
            (input)="onEmployeeSearchInput($event)"
            (focus)="openEmployeeDropdown()"
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            class="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="{ 'bg-white': isEmployeeDropdownOpen() && !disabled() }">
          
          <!-- Iconos de la derecha -->
          <div class="absolute inset-y-0 right-3 flex items-center gap-1.5">
            @if (selectedId() && !isEmployeeDropdownOpen() && !disabled()) {
              <button 
                type="button"
                (click)="clearEmployeeSelection($event)"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded transition-colors cursor-pointer">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            }
            <span class="text-gray-400 pointer-events-none">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
        </div>

        <!-- Panel Flotante con Resultados Filtrados -->
        @if (isEmployeeDropdownOpen() && !disabled()) {
          <div class="absolute z-50 w-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-150 dark:divide-gray-800/60 animate-fadeIn animate-duration-150">
            @if (filteredEmployees().length === 0) {
              <div class="p-4 text-center text-xs text-gray-400">
                No se encontraron empleados coincidentes.
              </div>
            } @else {
              @for (emp of filteredEmployees(); track (emp.id_empleado || emp.employee_id || emp.id_employee || emp.id)) {
                <button 
                  type="button"
                  (click)="selectEmployee(emp, $event)"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors flex flex-col gap-0.5 cursor-pointer">
                  <span class="font-bold text-sm text-gray-800 dark:text-gray-200">
                    {{ emp.fullName || ((emp.first_surname || '') + ' ' + (emp.second_surname || '') + ' ' + (emp.name || '')) }}
                  </span>
                  <span class="text-[10px] text-gray-450 flex flex-wrap items-center gap-1.5">
                    <span class="font-semibold text-gray-500 dark:text-gray-400">RFC: {{ emp.rfc || 'N/A' }}</span>
                    <span>•</span>
                    @if (emp.area_name) {
                      <span class="text-[#BC955C] font-semibold">Puesto: {{ emp.job_name || emp.job_position || 'Sin Puesto' }} en {{ emp.area_name }}</span>
                    } @else if (emp.resolvedJobPosition) {
                      <span class="text-[#BC955C] font-semibold">Puesto: {{ emp.resolvedJobPosition }}</span>
                    } @else if (emp.job_position) {
                      <span class="text-[#BC955C] font-semibold">Puesto: {{ emp.job_position }}</span>
                    } @else {
                      <span class="text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-0.5">⚠️ Sin Adscripción Activa</span>
                    }
                  </span>
                </button>
              }
            }
          </div>
        }
      </div>

      <!-- Botón de recarga -->
      @if (showReload()) {
        <button 
          type="button" 
          (click)="onReload.emit()"
          [disabled]="isLoading() || disabled()"
          class="p-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500 hover:text-[#691C32] dark:hover:text-[#BC955C] active:scale-95 flex items-center justify-center shrink-0 disabled:opacity-50"
          title="Recargar empleados">
          @if (isLoading()) {
            <span class="flex items-center justify-center" [innerHTML]="icons.animated_reload | safeHtml"></span>
          } @else {
            <span class="w-4 h-4 flex items-center justify-center" [innerHTML]="icons.Refresh | safeHtml"></span>
          }
        </button>
      }

    </div>
  `
})
export class EmployeeSelectComponent {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  employeesList = input<any[]>([]);
  placeholder = input<string>('Buscar por nombre o RFC...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(false);
  isLoading = input<boolean>(false);

  onSelect = output<any>();
  onClear = output<void>();
  onReload = output<void>();

  employeeSearchQuery = signal<string>('');
  isEmployeeDropdownOpen = signal<boolean>(false);

  selectedEmployeeLabel = computed(() => {
    const val = this.selectedId();
    if (!val) return '';
    const emp = this.employeesList().find(e => 
      e.employee_id === val || e.id_employee === val || e.id === val || e.id_empleado === val
    );
    if (emp) {
      const fullName = emp.fullName || `${emp.name || ''} ${emp.first_surname || ''} ${emp.second_surname || ''}`.replace(/\s+/g, ' ').trim();
      return `${fullName} (${emp.rfc || ''})`.trim();
    }
    return '';
  });

  filteredEmployees = computed(() => {
    const rawQuery = this.employeeSearchQuery();
    
    // Normalizar texto para eliminar acentos/diacríticos y pasarlo a minúsculas
    const normalizeStr = (str: string) => {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    };

    const query = normalizeStr(rawQuery);
    const list = this.employeesList();
    
    if (!query) {
      return list.slice(0, 15);
    }
    
    return list.filter(emp => {
      const fullName = normalizeStr(emp.fullName || `${emp.name || ''} ${emp.first_surname || ''} ${emp.second_surname || ''}`);
      const rfc = normalizeStr(emp.rfc);
      
      // Buscar también por puesto/área para mayor flexibilidad
      const jobName = normalizeStr(emp.job_name || emp.job_position || emp.resolvedJobPosition);
      const areaName = normalizeStr(emp.area_name || emp.area);
      
      return fullName.includes(query) || 
             rfc.includes(query) || 
             jobName.includes(query) || 
             areaName.includes(query);
    }).slice(0, 30);
  });

  onEmployeeSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.employeeSearchQuery.set(val);
  }

  openEmployeeDropdown() {
    if (this.disabled()) return;
    this.employeeSearchQuery.set('');
    this.isEmployeeDropdownOpen.set(true);
  }

  closeEmployeeDropdown() {
    this.isEmployeeDropdownOpen.set(false);
  }

  selectEmployee(emp: any, event: Event) {
    event.stopPropagation();
    this.onSelect.emit(emp);
    this.isEmployeeDropdownOpen.set(false);
    this.employeeSearchQuery.set('');
  }

  clearEmployeeSelection(event: Event) {
    event.stopPropagation();
    this.onClear.emit();
    this.employeeSearchQuery.set('');
  }
}

