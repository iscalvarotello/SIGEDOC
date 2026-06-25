import { Component, input, output, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '../../../icons/svg-icons';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

@Component({
  selector: 'app-job-position-select',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          {{ label() }}
        </label>
        
        <!-- Selector de Segmentos de Filtro de Puestos -->
        @if (!disabled()) {
          <div class="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-bold">
            <button 
              type="button"
              (click)="setPositionFilter('principal')"
              class="px-2 py-1 rounded-md transition-all cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-gray-700 text-[#691C32] dark:text-white shadow-sm': positionFilter() === 'principal',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': positionFilter() !== 'principal'
              }">
              Titulares
            </button>
            <button 
              type="button"
              (click)="setPositionFilter('operativo')"
              class="px-2 py-1 rounded-md transition-all cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-gray-700 text-[#691C32] dark:text-white shadow-sm': positionFilter() === 'operativo',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': positionFilter() !== 'operativo'
              }">
              Operativos
            </button>
            <button 
              type="button"
              (click)="setPositionFilter('todos')"
              class="px-2 py-1 rounded-md transition-all cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-gray-700 text-[#691C32] dark:text-white shadow-sm': positionFilter() === 'todos',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': positionFilter() !== 'todos'
              }">
              Todos
            </button>
          </div>
        }
      </div>
      
      <div class="flex items-center gap-1.5 w-full">
        <div class="relative flex-1">
          <select 
            [value]="selectedId()"
            [disabled]="disabled()"
            (change)="onSelectChange($event)"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all disabled:opacity-50 appearance-none cursor-pointer">
            <option value="" disabled selected>Seleccione un puesto del catálogo...</option>
            @for (jp of filteredPositions(); track jp.id) {
              <option [value]="jp.id">
                {{ jp.name }} ({{ jp.category || 'Hacienda' }})
              </option>
            }
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        @if (showReload()) {
          <button 
            type="button" 
            (click)="onReload.emit()"
            [disabled]="isLoading() || disabled()"
            class="p-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500 hover:text-[#691C32] dark:hover:text-[#BC955C] active:scale-95 flex items-center justify-center shrink-0 disabled:opacity-50"
            title="Recargar puestos">
            @if (isLoading()) {
              <span class="flex items-center justify-center" [innerHTML]="icons.animated_reload | safeHtml"></span>
            } @else {
              <span class="w-4 h-4 flex items-center justify-center" [innerHTML]="icons.Refresh | safeHtml"></span>
            }
          </button>
        }
      </div>
    </div>
  `
})
export class JobPositionSelectComponent implements OnChanges {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  positionsList = input<any[]>([]);
  label = input<string>('Puesto Asignado');
  disabled = input<boolean>(false);
  initialFilter = input<'principal' | 'operativo' | 'todos'>('todos');
  showReload = input<boolean>(false);
  isLoading = input<boolean>(false);
  includeAllEmployees = input<boolean>(false);

  onSelect = output<any>();
  onReload = output<void>();

  positionFilter = signal<'principal' | 'operativo' | 'todos'>('todos');

  filteredPositions = computed(() => {
    const list = this.positionsList();
    const filter = this.positionFilter();
    
    if (filter === 'operativo') {
      const operatives = list.filter(p => !p.principal);
      return this.includeAllEmployees()
        ? [{ id: 'ALL_EMPLOYES', name: 'Todo el personal', category: 'General', principal: false }, ...operatives]
        : operatives;
    }
    if (filter === 'principal') {
      return list.filter(p => p.principal);
    }
    
    // todos
    return this.includeAllEmployees()
      ? [{ id: 'ALL_EMPLOYES', name: 'Todo el personal', category: 'General', principal: false }, ...list]
      : list;
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFilter']) {
      this.positionFilter.set(this.initialFilter());
    }
  }

  setPositionFilter(filter: 'principal' | 'operativo' | 'todos') {
    this.positionFilter.set(filter);
  }

  onSelectChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    const found = this.positionsList().find(p => p.id === val);
    if (found) {
      this.onSelect.emit(found);
    }
  }
}
