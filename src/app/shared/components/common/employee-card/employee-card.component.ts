import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (layout() === 'leadership') {
      <!-- Diseño de Liderazgo (Titular / Encargado) -->
      <div class="flex flex-col p-5 rounded-xl border transition-all h-full"
           [ngClass]="adscription() ? activeClass() : 'bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-800'">
        
        <div class="flex items-start justify-between">
          <span class="text-xs font-bold uppercase px-2 py-0.5 rounded"
                [ngClass]="roleLabelClass() || (roleLabel().toLowerCase().includes('titular') || roleLabel().toLowerCase().includes('jefe') ? 'bg-[#691C32]/10 text-[#691C32]' : 'bg-[#BC955C]/10 text-[#BC955C]')">
            {{ roleLabel() }}
          </span>
          
          @if (adscription()) {
            <div class="flex gap-1.5">
              <button (click)="onEdit.emit(adscription()!)" 
                      class="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer" 
                      title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button (click)="onDismiss.emit(adscription()!)" 
                      class="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer" 
                      title="Remover">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          }
        </div>

        @if (adscription()) {
          <div class="flex items-center gap-3.5 mt-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                 [ngClass]="avatarClass()">
              {{ adscription()!.name.substring(0,2).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                {{ adscription()?.fullName }}
              </h4>
              <p class="text-xs text-gray-500 font-semibold truncate mt-0.5">
                {{ adscription()?.resolvedJobPosition }}
              </p>
              <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span>📅 Alta: {{ adscription()?.start_date }}</span>
              </p>
            </div>
          </div>
        } @else {
          <div class="flex-1 flex flex-col items-center justify-center py-6 text-gray-400 dark:text-gray-600 text-xs">
            <span>{{ emptyMessage() }}</span>
          </div>
        }
      </div>

    } @else {
      <!-- Diseño Operativo / Grid de Apoyo -->
      <div class="bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start gap-3.5 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all group relative">
        
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
             [ngClass]="avatarClass()">
          {{ adscription()?.name?.substring(0,2)?.toUpperCase() }}
        </div>

        <!-- Detalles -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">
            {{ adscription()?.fullName }}
          </h4>
          <p class="text-xs text-gray-500 font-semibold truncate mt-0.5">
            {{ adscription()?.resolvedJobPosition }}
          </p>

          <!-- Roles Específicos -->
          @if (showSwitches() || adscription()?.is_reception || adscription()?.is_reviewer) {
            <div class="flex flex-wrap gap-1 mt-2">
              @if (adscription()?.is_reception) {
                <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-0.5">
                  <span>📨 Recepción</span>
                </span>
              }
              @if (adscription()?.is_reviewer) {
                <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-0.5">
                  <span>📋 Revisor</span>
                </span>
              }
            </div>
          }
          
          <p class="text-[10px] text-gray-400 mt-2 flex items-center gap-1.5">
            <span>📅 Inicio: {{ adscription()?.start_date }}</span>
            @if (adscription()?.end_date) {
              <span>•</span>
              <span>Fin: {{ adscription()?.end_date }}</span>
            }
          </p>
        </div>

        <!-- Acciones flotantes a la derecha -->
        <div class="flex gap-1 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button (click)="onEdit.emit(adscription()!)" 
                  class="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer" 
                  title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button (click)="onDismiss.emit(adscription()!)" 
                  class="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer" 
                  title="Remover">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class EmployeeCardComponent {
  adscription = input<any | null>(null);
  layout = input<'leadership' | 'operative'>('leadership');
  roleLabel = input<string>('');
  roleLabelClass = input<string>('');
  emptyMessage = input<string>('Sin asignación');
  activeCardClass = input<string>('');
  showSwitches = input<boolean>(false);

  onEdit = output<any>();
  onDismiss = output<any>();

  // Clases activas precalculadas para evitar problemas de purga de Tailwind CSS
  activeClass = computed(() => {
    if (this.activeCardClass()) {
      return this.activeCardClass();
    }
    const label = this.roleLabel().toLowerCase();
    if (label.includes('titular') || label.includes('jefe')) {
      return 'bg-[#691C32]/5 border-[#691C32]/20 dark:border-[#691C32]/40';
    } else if (label.includes('encargado') || label.includes('senescal')) {
      return 'bg-[#BC955C]/5 border-[#BC955C]/20 dark:border-[#BC955C]/40';
    }
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  });

  // Avatar dinámico y armonizado
  avatarClass = computed(() => {
    const adsc = this.adscription();
    if (!adsc) return '';

    if (this.layout() === 'operative') {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }

    const label = this.roleLabel().toLowerCase();
    const isTitular = label.includes('titular') || label.includes('jefe');
    if (isTitular) {
      return adsc.sex === 'M' ? 'bg-[#BC955C] text-white' : 'bg-[#691C32] text-white';
    } else {
      return adsc.sex === 'M' ? 'bg-[#691C32] text-white' : 'bg-[#BC955C] text-white';
    }
  });
}
