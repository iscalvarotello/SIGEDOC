import { Component, OnInit, forwardRef, inject, signal, computed, effect, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { StateService } from '@location/states/state.service';
import { StateDTO } from '@location/states/state.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

@Component({
  selector: 'app-state-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="statesOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled() || !!(countryId() && statesList().length === 0)"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="value()">
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.name">
            {{ opt.raw.emoji || '📍' }} {{ opt.raw.name }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">Cód: </span>
            <span class="text-theme-secondary font-semibold truncate block" [title]="opt.raw.state_code || 'N/A'">{{ opt.raw.state_code || 'N/A' }}</span>
            @if (opt.raw.country) {
              <span class="shrink-0">•</span>
              <span class="text-gray-600 dark:text-gray-300 font-semibold truncate block">
                {{ opt.raw.country }}
              </span>
            }
          </span>
        </div>
      </ng-template>
    </app-listbox>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StateSelectComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class StateSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  icons = SVG_ICONS;
  
  // Custom Inputs
  statesListInput = input<StateDTO[] | null>(null, { alias: 'statesList' });
  countryId = input<string | null>(null);
  
  placeholder = input<string>('Buscar estado...');
  disabledInput = input<boolean>(false);
  showReload = input<boolean>(true);
  isLoadingInput = input<boolean | null>(null, { alias: 'isLoading' });
  
  // Outputs
  onSelect = output<StateDTO | null>();
  onClear = output<void>();
  onReload = output<void>();

  // State
  private _internalList = signal<StateDTO[]>([]);
  private _internalLoading = signal<boolean>(false);
  
  // Computed (Hybrid Support)
  statesList = computed(() => this.statesListInput() !== null ? this.statesListInput()! : this._internalList());
  isLoading = computed(() => this.isLoadingInput() !== null ? this.isLoadingInput()! : this._internalLoading());
  
  // Value Accessor
  value = signal<string>('');
  disabled = signal<boolean>(false);
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  private stateService = inject(StateService);

  constructor() {
    effect(() => {
      const isInputDisabled = this.disabledInput();
      this.disabled.set(isInputDisabled);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    if (this.statesListInput() === null) {
      this.loadStates();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countryId']) {
      // Si cambia el countryId y no estamos usando una lista inyectada, recargamos
      if (this.statesListInput() === null) {
        this.loadStates();
      }
    }
  }

  async loadStates(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const cid = this.countryId();
      if (cid) {
        // Filtrar por país
        const res = await this.stateService.getByCountry(cid);
        this._internalList.set(res.data || []);
      } else {
        // Obtener todos
        const res = await this.stateService.getAll(undefined, { enabled: true, key: 'STATES_ALL' }, forceRefresh);
        this._internalList.set(res.data || []);
      }
    } catch (err) {
      console.error('Error al cargar estados:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    this.onReload.emit();
    if (this.statesListInput() === null) {
      this.loadStates(true);
    }
  }

  statesOptions = computed(() => {
    return this.statesList().map(s => ({
      value: s.id,
      label: s.name,
      raw: s,
      iconKey: 'iconMap'
    }));
  });

  handleSelectionChange(selectedOption: any | null) {
    const selectedId = selectedOption ? selectedOption.value : '';
    this.value.set(selectedId);
    this.onChange(selectedId);
    this.onTouched();
    
    if (selectedId) {
      const obj = this.statesList().find(s => s.id === selectedId) || null;
      setTimeout(() => {
        this.onSelect.emit(obj);
      });
    } else {
      setTimeout(() => {
        this.onClear.emit();
        this.onSelect.emit(null);
      });
    }
  }

  // --- Control Value Accessor ---
  writeValue(val: any): void {
    if (val !== undefined && val !== null) {
      this.value.set(val);
    } else {
      this.value.set('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled || this.disabledInput());
  }
}
