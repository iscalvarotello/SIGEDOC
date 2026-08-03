import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';

@Component({
  selector: 'app-employee-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="listboxOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      [customFilter]="customFilter"
      (onReload)="onReload.emit()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
      
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.fullName || ((opt.raw.first_surname || '') + ' ' + (opt.raw.second_surname || '') + ' ' + (opt.raw.name || ''))">
            {{ opt.raw.fullName || ((opt.raw.first_surname || '') + ' ' + (opt.raw.second_surname || '') + ' ' + (opt.raw.name || '')) }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">RFC: {{ opt.raw.rfc || 'N/A' }}</span>
            <span class="shrink-0">•</span>
            @if (opt.raw.area_name) {
              <span class="text-theme-secondary font-semibold truncate block" [title]="'Puesto: ' + (opt.raw.job_name || opt.raw.job_position || 'Sin Puesto') + ' en ' + opt.raw.area_name">Puesto: {{ opt.raw.job_name || opt.raw.job_position || 'Sin Puesto' }} en {{ opt.raw.area_name }}</span>
            } @else if (opt.raw.resolvedJobPosition) {
              <span class="text-theme-secondary font-semibold truncate block" [title]="'Puesto: ' + opt.raw.resolvedJobPosition">Puesto: {{ opt.raw.resolvedJobPosition }}</span>
            } @else if (opt.raw.job_position) {
              <span class="text-theme-secondary font-semibold truncate block" [title]="'Puesto: ' + opt.raw.job_position">Puesto: {{ opt.raw.job_position }}</span>
            } @else {
              <span class="text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-0.5 shrink-0">⚠️ Sin Adscripción Activa</span>
            }
          </span>
        </div>
      </ng-template>
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class EmployeeSelectComponent {
  selectedId = input<string>('');
  employeesList = input<any[]>([]);
  placeholder = input<string>('Buscar por nombre o RFC...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(false);
  isLoading = input<boolean>(false);

  onSelect = output<any>();
  onClear = output<void>();
  onReload = output<void>();

  listboxOptions = computed(() => {
    const list = this.employeesList();
    console.log('EmployeeSelectComponent: employeesList (from input) =>', list);
    
    const mapped = list.map(emp => {
      const fullName = emp.fullName || `${emp.name || ''} ${emp.first_surname || ''} ${emp.second_surname || ''}`.replace(/\s+/g, ' ').trim();
      return {
        value: emp.id_empleado || emp.employee_id || emp.id_employee || emp.id,
        label: `${fullName} (${emp.rfc || ''})`.trim(),
        raw: emp,
        iconKey: 'AvatarPremium'
      };
    });
    
    console.log('EmployeeSelectComponent: listboxOptions (mapped output) =>', mapped);
    return mapped;
  });

  customFilter = (opt: any, query: string) => {
    const emp = opt.raw;
    const normalizeStr = (str: string) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const fullName = normalizeStr(emp.fullName || `${emp.name || ''} ${emp.first_surname || ''} ${emp.second_surname || ''}`);
    const rfc = normalizeStr(emp.rfc);
    const jobName = normalizeStr(emp.job_name || emp.job_position || emp.resolvedJobPosition);
    const areaName = normalizeStr(emp.area_name || emp.area);
    
    return fullName.includes(query) || 
           rfc.includes(query) || 
           jobName.includes(query) || 
           areaName.includes(query);
  };

  handleSelectionChange(opt: any) {
    if (opt) {
      this.onSelect.emit(opt.raw);
    } else {
      this.onClear.emit();
    }
  }
}

