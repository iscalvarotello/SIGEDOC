import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const COL_SPAN_MAP: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12'
};

@Component({
  selector: 'app-split-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full min-h-screen p-6 bg-[#F4F6F8] dark:bg-gray-955 gap-6">
      
      <!-- Encabezado Principal -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            @if (icon()) {
              <span>{{ icon() }}</span>
            }
            <span>{{ title() }}</span>
          </h1>
          @if (subtitle()) {
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {{ subtitle() }}
            </p>
          }
        </div>
        <!-- Slot para controles adicionales en la cabecera -->
        <div class="flex items-center gap-2">
          <ng-content select="[headerActions]"></ng-content>
        </div>
      </div>

      <!-- Cuerpo Dual -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
        
        <!-- Panel Izquierdo Genérico -->
        <div 
          [ngClass]="colSpanLeftClass()"
          [style.max-height]="maxHeightLeft()"
          class="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 overflow-hidden"
          [class]="leftPaneClasses()">
          <ng-content select="[leftPane]"></ng-content>
        </div>

        <!-- Panel Derecho Genérico -->
        <div 
          [ngClass]="colSpanRightClass()"
          class="flex flex-col gap-6 h-full min-h-[500px]"
          [class]="rightPaneClasses()">
          <ng-content select="[rightPane]"></ng-content>
        </div>

      </div>
    </div>
  `
})
export class SplitLayoutComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  icon = input<string>('');
  colSpanLeft = input<number>(4);
  colSpanRight = input<number>(8);
  maxHeightLeft = input<string>('780px');
  leftPaneClasses = input<string>('');
  rightPaneClasses = input<string>('');

  colSpanLeftClass = computed(() => {
    return COL_SPAN_MAP[this.colSpanLeft()] || 'lg:col-span-4';
  });

  colSpanRightClass = computed(() => {
    return COL_SPAN_MAP[this.colSpanRight()] || 'lg:col-span-8';
  });
}
