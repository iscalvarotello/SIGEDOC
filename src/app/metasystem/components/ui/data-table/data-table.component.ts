import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  title: string;
  class?: string;
}

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto overflow-hidden border border-gray-150 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
      <table class="w-full text-left text-xs">
        <thead class="bg-theme-primary text-white dark:bg-gray-955 uppercase font-bold border-b border-gray-150 dark:border-gray-800">
          <tr>
            @for (col of parsedColumns; track $index) {
              <th class="px-5 py-3" [ngClass]="col.class || ''">{{ col.title }}</th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-850">
          @if (loading) {
            <tr>
              <td [attr.colspan]="parsedColumns.length" class="px-5 py-8 text-center text-gray-400">
                <span class="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                <p class="text-xs mt-2">{{ loadingMessage }}</p>
              </td>
            </tr>
          } @else {
            @for (item of data; track item.id || $index) {
              <tr [ngClass]="css_row || 'hover:bg-gray-50/50 dark:hover:bg-gray-955/30 text-gray-700 dark:text-gray-300'">
                <ng-container *ngTemplateOutlet="rowTemplate; context: { $implicit: item }"></ng-container>
              </tr>
            }
            @if (!data || data.length === 0) {
              <tr>
                <td [attr.colspan]="parsedColumns.length" class="px-5 py-6 text-center text-gray-400">{{ emptyMessage }}</td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class DataTableComponent {
  @Input() columns: (string | TableColumn)[] = [];
  @Input() data: any[] | null = [];
  @Input() loading: boolean = false;
  @Input() loadingMessage: string = 'Cargando datos...';
  @Input() emptyMessage: string = 'No se encontraron resultados.';
  @Input() css_row?: string;

  @ContentChild(TemplateRef) rowTemplate!: TemplateRef<any>;

  get parsedColumns(): TableColumn[] {
    return this.columns.map(c => typeof c === 'string' ? { title: c } : c);
  }
}
