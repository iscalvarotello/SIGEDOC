import { Component, inject, input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericApiService } from '../../../core/services/generic-api.service';
import { ApiSelectConfig, FormFieldConfig } from '../../interfaces/dynamic-form.interface';

@Component({
  selector: 'app-api-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative">
      @if (field().apiConfig?.multiple) {
        <div class="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
             [ngClass]="{'border-red-300': control().invalid && control().touched, 'opacity-50 pointer-events-none': isLoading()}">
          @if (isLoading()) {
            <div class="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
               <svg class="animate-spin h-4 w-4 text-[#691C32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Cargando...
            </div>
          } @else if (options().length === 0) {
            <div class="p-2 text-center text-gray-500 text-sm">No hay opciones disponibles</div>
          } @else {
            <div class="flex flex-col gap-1.5">
              @for (opt of options(); track opt.value) {
                <label class="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors group">
                  <input type="checkbox" 
                         [checked]="isOptionChecked(opt.value)"
                         (change)="toggleOption(opt.value, $event)"
                         class="w-4 h-4 text-[#691C32] bg-white border-gray-300 rounded focus:ring-[#691C32] focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#691C32] dark:group-hover:text-[#BC955C] transition-colors">{{ opt.label }}</span>
                </label>
              }
            </div>
          }
        </div>
      } @else {
        <select 
          [formControl]="control()"
          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 focus:border-[#691C32] transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
          [ngClass]="{'border-red-300 focus:ring-red-500/50 focus:border-red-500': control().invalid && control().touched}"
        >
          <option value="" disabled selected>{{ field().placeholder || 'Seleccione una opción...' }}</option>
          
          @for (opt of options(); track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>

        <!-- Spinner Interno (Cargando) -->
        @if (isLoading()) {
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg class="animate-spin h-5 w-5 text-[#691C32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        } @else {
          <!-- Flechita estándar -->
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        }
      }
    </div>
  `
})
export class ApiSelectComponent implements OnInit, OnDestroy {
  control = input.required<FormControl>();
  field = input.required<FormFieldConfig>();
  formGroup = input.required<FormGroup>(); // Para escuchar a otros controles dependientes
  
  private apiService = inject(GenericApiService);
  
  options = signal<{value: any, label: string}[]>([]);
  isLoading = signal<boolean>(false);
  
  private sub?: Subscription;

  isMulti(): boolean {
    return !!this.field().apiConfig?.multiple;
  }

  ngOnInit() {
    const apiConfig = this.field().apiConfig;
    if (!apiConfig) return;

    if (apiConfig.dependsOnField) {
      // Es un combo dependiente (ej. Estado depende de País)
      this.setupDependency(apiConfig);
    } else {
      // Es un combo de primer nivel (ej. Países)
      this.fetchData(apiConfig);
    }
  }

  private setupDependency(config: ApiSelectConfig) {
    const parentControl = this.formGroup().get(config.dependsOnField!);
    if (!parentControl) {
      console.warn(`[ApiSelect] El control padre ${config.dependsOnField} no existe en el formulario.`);
      return;
    }

    // Si el padre ya tiene valor inicial (ej. Modo Edición), disparamos de inmediato
    if (parentControl.value) {
      this.fetchData(config, parentControl.value);
    } else {
      this.control().disable(); // Deshabilitamos hasta que el padre tenga valor
    }

    // Nos subscribimos a los cambios del padre
    this.sub = parentControl.valueChanges.subscribe(parentValue => {
      if (!parentValue) {
        this.options.set([]);
        this.control().setValue(null);
        this.control().disable();
      } else {
        this.control().setValue(null); // Limpiamos el valor actual al cambiar el padre
        this.fetchData(config, parentValue);
      }
    });
  }

  private async fetchData(config: ApiSelectConfig, dependencyValue?: any) {
    this.isLoading.set(true);
    const currentValue = this.control().value;
    this.control().disable();

    try {
      let queryParams: Record<string, any> = {};
      if (config.staticQueryParams) {
        queryParams = { ...config.staticQueryParams };
      }
      if (dependencyValue && config.dependencyQueryParam) {
        queryParams[config.dependencyQueryParam] = dependencyValue;
      }

      const rawData = await this.apiService.getDropdownOptions(config.configKey, queryParams, config.cache);
      
      // Mapear los resultados
      const mappedOptions = rawData.map(item => {
        let label = '';
        if (typeof config.labelKey === 'function') {
          label = config.labelKey(item);
        } else {
          label = item[config.labelKey];
        }
        return {
          value: item[config.valueKey],
          label: label
        };
      });

      this.options.set(mappedOptions);
    } catch (error) {
      console.error(`[ApiSelect] Error cargando datos para ${this.field().key}`, error);
      this.options.set([]);
    } finally {
      this.isLoading.set(false);
      this.control().enable();
      if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
        this.control().setValue(currentValue, { emitEvent: false });
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  isOptionChecked(value: any): boolean {
    const currentVal = this.control().value;
    if (Array.isArray(currentVal)) {
      // Usar comparación convirtiendo a string por si el backend manda numbers en uno y strings en otro
      return currentVal.some(v => String(v) === String(value));
    }
    return false;
  }

  toggleOption(value: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    let currentVal = this.control().value;
    
    if (!Array.isArray(currentVal)) {
      currentVal = [];
    }
    
    if (isChecked) {
      this.control().setValue([...currentVal, value]);
    } else {
      this.control().setValue(currentVal.filter((v: any) => String(v) !== String(value)));
    }
    this.control().markAsDirty();
    this.control().markAsTouched();
  }
}
