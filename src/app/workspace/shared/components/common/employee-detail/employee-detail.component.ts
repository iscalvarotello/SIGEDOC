import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (!employee()) {
      <!-- Mensaje por defecto cuando no hay colaborador seleccionado -->
      <div class="py-12 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
        <icon icon="InfoCircle" class="w-6 h-6 text-gray-300 dark:text-gray-750"></icon>
        <span>Seleccione un colaborador de la lista izquierda para desplegar su ficha de control horario, ubicación y firma de oficios.</span>
      </div>
    } @else {
      <!-- Contenido de Detalle Premium -->
      <div class="flex flex-col gap-4 animate-fadeIn">
        <!-- Cabecera de Ficha -->
        <div class="flex items-center gap-3.5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm"
               [ngClass]="employee()?.sex === 'M' ? 'bg-theme-secondary' : 'bg-theme-primary'">
            {{ employee()?.name?.substring(0,2)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {{ (employee()?.prefix ? employee()?.prefix + ' ' : '') + employee()?.fullName }}
            </h4>
            <p class="text-xs text-gray-500 font-semibold truncate mt-1">
              {{ employee()?.fullJobAndArea }}
            </p>
          </div>
        </div>

        <!-- Atributos Horarios y Administrativos -->
        <div class="grid grid-cols-2 gap-3.5 text-xs">
          <div class="flex flex-col p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 rounded-xl">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reloj Checador</span>
            <span class="font-bold text-gray-800 dark:text-gray-250 mt-1">
              🔑 {{ employee()?.check_number || 'No asignada' }}
            </span>
          </div>

          <div class="flex flex-col p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 rounded-xl">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sigla Firma (Oficios)</span>
            <span class="font-bold text-gray-800 dark:text-gray-255 mt-1">
              ✍️ {{ employee()?.ref_doc || 'No asignada' }}
            </span>
          </div>

          <div class="flex flex-col p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 rounded-xl">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Horario de Entrada</span>
            <span class="font-bold text-gray-800 dark:text-gray-250 mt-1">
              🌅 {{ employee()?.check_in_hour || 'Sin control' }}
            </span>
          </div>

          <div class="flex flex-col p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 rounded-xl">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Horario de Salida</span>
            <span class="font-bold text-gray-800 dark:text-gray-250 mt-1">
              🌇 {{ employee()?.check_out_hour || 'Sin control' }}
            </span>
          </div>
        </div>

        <!-- Ubicación y Roles -->
        <div class="flex flex-col gap-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 p-4 rounded-xl text-xs">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Información Adicional</span>
          
          <div class="flex items-center gap-2 justify-between mt-1 text-gray-650 dark:text-gray-350">
            <span class="font-semibold text-gray-500">RFC</span>
            <span class="font-bold font-mono">{{ employee()?.rfc || 'N/A' }}</span>
          </div>

          <div class="flex items-center gap-2 justify-between text-gray-655 dark:text-gray-350">
            <span class="font-semibold text-gray-500">Ubicación Física</span>
            <span class="font-bold truncate text-right max-w-[200px]" [title]="employee()?.branch">
              🏢 {{ employee()?.branch || 'N/A' }}
            </span>
          </div>

          <div class="flex items-center gap-2 justify-between text-gray-655 dark:text-gray-350">
            <span class="font-semibold text-gray-500">Ciudad</span>
            <span class="font-bold">📍 {{ employee()?.city }}, {{ employee()?.state }}</span>
          </div>

          <div class="flex items-center gap-2 justify-between text-gray-655 dark:text-gray-350">
            <span class="font-semibold text-gray-500">Vigencia Alta</span>
            <span class="font-bold">📅 {{ employee()?.start_date }}</span>
          </div>

          <div class="flex flex-wrap gap-1 mt-2.5 border-t border-gray-50 dark:border-gray-700/60 pt-2.5">
            @if (employee()?.is_reception) {
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-0.5">
                📨 Habilitado para Recepción
              </span>
            }
            @if (employee()?.is_reviewer) {
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-0.5">
                📋 Revisor de Documentos
              </span>
            }
            @if (!employee()?.is_reception && !employee()?.is_reviewer) {
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                Personal Operativo Estándar
              </span>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class EmployeeDetailComponent {
  employee = input<any | null>(null);
}
