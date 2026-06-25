import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderConfig, FieldConfig } from './master-detail.interfaces';

@Component({
  selector: 'app-detail-viewer',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'flex-1 flex flex-col overflow-hidden'
  },
  template: `
    @if (data()) {
      <div class="p-4 flex-1 overflow-y-auto">
        <!-- Encabezado Detalle -->
        <div class="text-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          @if (headerConfig().emojiField) {
            <div class="text-[3rem] leading-none mb-3 animate-bounce-short">
              {{ data()[headerConfig().emojiField!] }}
            </div>
          }
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {{ data()[headerConfig().titleField] }}
          </h2>
          @if (headerConfig().subtitleField) {
            <p class="text-[10px] font-mono text-gray-400 bg-gray-50 dark:bg-gray-900 inline-block px-2 py-0.5 rounded">
              {{ headerConfig().subtitleLabel ? headerConfig().subtitleLabel + ': ' : '' }}{{ data()[headerConfig().subtitleField!] }}
            </p>
          }
          @if (data().id) {
            <div class="mt-1.5">
              <span class="text-[9px] font-mono text-gray-400 bg-gray-50 dark:bg-gray-950 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-800 select-all cursor-pointer" title="ID del Registro (Hacer doble clic para copiar)">
                ID: {{ data().id }}
              </span>
            </div>
          }
        </div>

        <!-- Campos de Detalle Dinámicos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          @for (field of fields(); track field.key) {
            @if (data()[field.key] !== undefined && data()[field.key] !== null && data()[field.key] !== '') {
              <div 
                class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
                [ngClass]="{'col-span-1 sm:col-span-2': field.label.length > 20 || (data()[field.key] && data()[field.key].toString().length > 30)}"
              >
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{{ field.label }}</label>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                  @if (field.type === 'link') {
                    <a 
                      [href]="field.linkBuilder ? field.linkBuilder(data()) : data()[field.key]" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-[#691C32] dark:text-[#BC955C] hover:underline flex items-center gap-2">
                      {{ field.prefix || '' }}{{ getFormattedValue(field, data()[field.key]) }}
                      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  } @else {
                    {{ field.prefix || '' }}{{ getFormattedValue(field, data()[field.key]) }}
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Pistas de Teclado -->
        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p class="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Navegación Rápida</p>
          <div class="flex justify-center gap-2 text-xs font-medium text-gray-500">
            <span class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm px-2 py-1 rounded">↑↓ Mover</span>
            <span class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm px-2 py-1 rounded">E Editar</span>
            <span class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm px-2 py-1 rounded">Supr Borrar</span>
          </div>
        </div>

        <!-- Acciones Personalizadas -->
        <ng-content></ng-content>
      </div>
    } @else {
      <!-- Estado Vacío -->
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50/30 dark:bg-gray-800/30">
        <div class="text-7xl mb-6 opacity-30 grayscale filter">🌎</div>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Ningún registro seleccionado</h3>
        <p class="text-sm max-w-[250px] leading-relaxed">Selecciona un elemento de la lista o usa las flechas de tu teclado (↑↓) para explorar los detalles.</p>
      </div>
    }
  `
})
export class DetailViewerComponent {
  data = input<any | null>(null);
  headerConfig = input.required<HeaderConfig>();
  fields = input.required<FieldConfig[]>();

  getFormattedValue(field: FieldConfig, rawValue: any): string {
    if (rawValue === undefined || rawValue === null || rawValue === '') return '';
    
    if (field.type === 'boolean') {
      // Forzamos el parseo a un boolean estricto
      // El backend a veces regresa un bit, a veces false, a veces ''
      const boolValue = (rawValue === true || rawValue === 1 || rawValue === '1' || rawValue === 'true');
      
      if (field.booleanLabels) {
        return boolValue ? field.booleanLabels.trueLabel : field.booleanLabels.falseLabel;
      }
      return boolValue ? 'Sí' : 'No';
    }
    
    if (field.type === 'enum' && field.options) {
      const found = field.options.find(opt => opt.value === rawValue);
      return found ? found.label : String(rawValue);
    }
    
    return String(rawValue);
  }
}
