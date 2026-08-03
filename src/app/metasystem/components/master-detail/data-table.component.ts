import { Component, input, output, HostListener, ViewChildren, QueryList, ElementRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ColumnConfig } from './master-detail.interfaces';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';
import { SesionService } from '@services/sesion.service';
import { ServerImageComponent } from '@system-shared/images/server-image/server-image.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, ServerImageComponent],
  template: `
    @if (isLoading()) {
      <!-- Skeleton Loader -->
      <div class="p-6 space-y-6">
        @for (i of [1,2,3,4,5,6]; track i) {
          <div class="animate-pulse flex items-center space-x-4">
            <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
            <div class="flex-1 space-y-3 py-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 w-full overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-theme-primary dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
          <tr>
            @for (col of columns(); track col.key) {
              <th 
                class="px-6 py-3 text-xs font-black text-white uppercase tracking-wider border-b border-theme-primary dark:border-gray-700 border-r border-white/20 last:border-r-0"
                [ngClass]="getAlignClass(col.align) + ' ' + (col.width || '')"
              >
                {{ col.label }}
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          
          @for (item of data(); track item.id; let idx = $index) {
            <tr 
              #rowElement
              (click)="selectRow(item)"
              class="group cursor-pointer transition-colors duration-150 border-l-4"
              [ngClass]="{
                'bg-theme-primary/5 border-theme-primary dark:bg-theme-primary/20': isSelected(item),
                'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50': !isSelected(item)
              }"
            >
              @for (col of columns(); track col.key) {
                <td 
                  class="px-6 py-3" 
                  [ngClass]="getAlignClass(col.align) + ' ' + (col.width || '')"
                >
                  @if (col.isAction) {
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button *ngIf="!isEditDisabled()" (click)="onEdit.emit(item); $event.stopPropagation()" class="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors" title="Editar (e)" [innerHTML]="iconLapiz | safeHtml"></button>
                      <button *ngIf="!isDeleteDisabled()" (click)="onDelete.emit(item); $event.stopPropagation()" class="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors" title="Eliminar (Supr)" [innerHTML]="iconBasurero | safeHtml"></button>
                    </div>
                  } @else if (col.type === 'image') {
                    @if (item[col.key]) {
                      <div class="h-10 w-10 p-1 bg-white border border-gray-200 rounded-md shadow-sm">
                        @if (col.imageEndpointKey && col.imageRouteKey) {
                          <server-image [endpointKey]="col.imageEndpointKey" [routeKey]="col.imageRouteKey" [params]="{id: item.id}" [timestamp]="true" imgClass="h-full w-full object-contain" css_marco="h-full w-full flex items-center justify-center relative"></server-image>
                        } @else {
                          <img [src]="item[col.key]" class="h-full w-full object-contain" alt="Imagen">
                        }
                      </div>
                    } @else {
                      <div class="h-10 w-10 p-1 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center">
                        <span class="text-[9px] text-gray-400 font-bold">N/A</span>
                      </div>
                    }
                  } @else {
                    <span [ngClass]="{'text-2xl': isEmoji(item[col.key]), 'text-sm text-gray-500': isSecondary(col.key), 'font-medium text-gray-900 dark:text-white': isPrimary(col.key)}">
                      {{ formatValue(item[col.key], col) }}
                    </span>
                  }
                </td>
              }
            </tr>
          }
          
          @if (data().length === 0) {
            <tr>
              <td [attr.colspan]="columns().length" class="px-6 py-12 text-center text-gray-500">
                <div class="text-4xl mb-3 opacity-50">🔍</div>
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
export class DataTableComponent {
  data = input.required<any[]>();
  columns = input.required<ColumnConfig[]>();
  selectedItem = input<any | null>(null);
  isLoading = input<boolean>(false);
  
  // Permisos para desactivar acciones de fila
  disableEdit = input<boolean>(false);
  disableDelete = input<boolean>(false);

  private sesionService = inject(SesionService);
  private router = inject(Router);

  isEditDisabled = computed(() => {
    if (this.disableEdit()) return true;
    return !this.sesionService.canUpdateCurrentRoute(this.router.url);
  });

  isDeleteDisabled = computed(() => {
    if (this.disableDelete()) return true;
    return !this.sesionService.canUpdateCurrentRoute(this.router.url);
  });

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

  isEmoji(val: any) {
    if (typeof val !== 'string') return false;
    const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    return regexExp.test(val);
  }

  isPrimary(key: string) {
    return key === 'name' || key === 'title';
  }

  isSecondary(key: string) {
    return !this.isPrimary(key) && key !== 'emoji' && key !== 'icon';
  }

  isSelected(item: any) {
    const selected = this.selectedItem();
    return selected && selected.id === item.id;
  }

  selectRow(item: any) {
    this.onRowSelect.emit(item);
  }

  formatValue(val: any, col?: ColumnConfig) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'boolean' && col?.booleanLabels) {
      return val ? col.booleanLabels.trueLabel : col.booleanLabels.falseLabel;
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
          if (currentSelected && !this.isEditDisabled()) this.onEdit.emit(currentSelected);
        }
        return;
        
      case 'Delete':
        if (!(event.target instanceof HTMLInputElement)) {
          if (currentSelected && !this.isDeleteDisabled()) this.onDelete.emit(currentSelected);
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
