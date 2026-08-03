import { Component, input, output, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixGroupConfig, MatrixColumnConfig } from './master-detail.interfaces';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';

@Component({
  selector: 'app-matrix-table',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    @if (isLoading()) {
      <!-- Skeleton Loader -->
      <div class="p-4 space-y-4">
        @for (i of [1,2,3,4,5]; track i) {
          <div class="animate-pulse flex items-center space-x-4">
            <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse whitespace-nowrap table-fixed">
          <thead class="bg-slate-100 dark:bg-slate-800/80 sticky top-0 z-10 shadow-sm">
            <!-- Fila de Grupos (Header Principal) -->
            <tr>
              @for (group of groups(); track group.title) {
                <th 
                  [attr.colspan]="group.columns.length"
                  class="px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-r last:border-r-0 border-slate-200 dark:border-slate-700 text-center bg-slate-200/50 dark:bg-slate-800"
                >
                  {{ group.title }}
                </th>
              }
              <!-- Columna de Acciones fantasma en el header superior para mantener la estructura -->
              <th class="border-b border-slate-200 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800 w-16"></th>
            </tr>
            <!-- Fila de Subcolumnas (Header Secundario) -->
            <tr>
              @for (group of groups(); track group.title) {
                @for (col of group.columns; track col.key) {
                  <th 
                    class="px-2 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700"
                    [ngClass]="getAlignClass(col.align) + ' ' + (col.width || '') + (isLastCol(group, col) ? ' border-r dark:border-slate-700' : '')"
                  >
                    {{ col.label }}
                  </th>
                }
              }
              <th class="px-2 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700 text-center w-16">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent">
            
            @for (item of data(); track item.id; let idx = $index) {
              <tr 
                #rowElement
                (click)="selectRow(item)"
                class="group cursor-pointer transition-colors duration-150 border-l-[3px]"
                [ngClass]="{
                  'bg-brand-50/50 border-brand-500 dark:bg-brand-500/10': isSelected(item),
                  'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30': !isSelected(item)
                }"
              >
                @for (group of groups(); track group.title) {
                  @for (col of group.columns; track col.key) {
                    <td 
                      class="px-2 py-2 truncate" 
                      [ngClass]="getAlignClass(col.align) + ' ' + (col.width || '') + (isLastCol(group, col) ? ' border-r border-slate-100 dark:border-slate-800/50' : '')"
                      [title]="formatValue(item[col.key], col)"
                    >
                      <span [ngClass]="{'font-medium text-slate-900 dark:text-white': col.type === 'text'}">
                        {{ formatValue(item[col.key], col) }}
                      </span>
                    </td>
                  }
                }
                
                <!-- Acciones -->
                <td class="px-2 py-1 text-center w-16">
                  <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="onEdit.emit(item); $event.stopPropagation()" class="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors" title="Editar (e)" [innerHTML]="iconLapiz | safeHtml"></button>
                    <button (click)="onDelete.emit(item); $event.stopPropagation()" class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors" title="Eliminar (Supr)" [innerHTML]="iconBasurero | safeHtml"></button>
                  </div>
                </td>
              </tr>
            }
            
            @if (data().length === 0) {
              <tr>
                <td [attr.colspan]="getTotalColumns() + 1" class="px-6 py-10 text-center text-slate-500">
                  <div class="text-3xl mb-2 opacity-50">🔍</div>
                  No se encontraron resultados.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
})
export class MatrixTableComponent {
  data = input.required<any[]>();
  groups = input.required<MatrixGroupConfig[]>();
  selectedItem = input<any | null>(null);
  isLoading = input<boolean>(false);

  onRowSelect = output<any>();
  onEdit = output<any>();
  onDelete = output<any>();

  iconLapiz = SVG_ICONS.Lapiz;
  iconBasurero = SVG_ICONS.Basurero;

  @ViewChildren('rowElement') rowElements!: QueryList<ElementRef>;

  getAlignClass(align?: 'left' | 'center' | 'right') {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  }

  isLastCol(group: MatrixGroupConfig, col: MatrixColumnConfig): boolean {
    return group.columns[group.columns.length - 1].key === col.key;
  }

  getTotalColumns(): number {
    return this.groups().reduce((sum, g) => sum + g.columns.length, 0);
  }

  isSelected(item: any) {
    const selected = this.selectedItem();
    return selected && selected.id === item.id;
  }

  selectRow(item: any) {
    this.onRowSelect.emit(item);
  }

  formatValue(val: any, col?: MatrixColumnConfig) {
    if (val === null || val === undefined) return '-';
    
    if (col?.type === 'currency' && typeof val === 'number') {
      return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    return val;
  }

  // Keyboard navigation & Auto-Scroll
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    }

    const list = this.data();
    if (!list || !list.length) return;

    const currentSelected = this.selectedItem();
    const currentIndex = currentSelected ? list.findIndex((x: any) => x.id === currentSelected.id) : -1;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < list.length - 1 ? currentIndex + 1 : (currentIndex === -1 ? 0 : currentIndex);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        break;
        
      case 'e':
      case 'E':
        if (!(event.target instanceof HTMLInputElement)) {
          event.preventDefault();
          if (currentSelected) this.onEdit.emit(currentSelected);
        }
        return;
        
      case 'Delete':
        if (!(event.target instanceof HTMLInputElement)) {
          if (currentSelected) this.onDelete.emit(currentSelected);
        }
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < list.length) {
      this.selectRow(list[newIndex]);
      this.scrollToRow(newIndex);
    }
  }

  private scrollToRow(index: number) {
    setTimeout(() => {
      const rowArr = this.rowElements.toArray();
      if (rowArr[index]) {
        rowArr[index].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}
