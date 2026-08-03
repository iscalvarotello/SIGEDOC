import { Component, OnInit, forwardRef, inject, signal, computed, effect, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { CityService } from '@location/cities/city.service';
import { CityDTO } from '@location/cities/city.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

@Component({
  selector: 'app-city-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="citiesOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled() || !!(stateId() && citiesList().length === 0)"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="value()">
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.city">
            {{ opt.raw.emoji || '🏙️' }} {{ opt.raw.city }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            @if (opt.raw.state) {
              <span class="font-semibold text-theme-secondary shrink-0">Edo: {{ opt.raw.state }}</span>
            }
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
      useExisting: forwardRef(() => CitySelectComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class CitySelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  icons = SVG_ICONS;
  
  // Custom Inputs
  citiesListInput = input<CityDTO[] | null>(null, { alias: 'citiesList' });
  stateId = input<string | null>(null);
  
  placeholder = input<string>('Buscar ciudad...');
  disabledInput = input<boolean>(false);
  showReload = input<boolean>(true);
  isLoadingInput = input<boolean | null>(null, { alias: 'isLoading' });
  
  // Outputs
  onSelect = output<CityDTO | null>();
  onClear = output<void>();
  onReload = output<void>();

  // State
  private _internalList = signal<CityDTO[]>([]);
  private _internalLoading = signal<boolean>(false);
  
  // Computed (Hybrid Support)
  citiesList = computed(() => this.citiesListInput() !== null ? this.citiesListInput()! : this._internalList());
  isLoading = computed(() => this.isLoadingInput() !== null ? this.isLoadingInput()! : this._internalLoading());
  
  // Value Accessor
  value = signal<string>('');
  disabled = signal<boolean>(false);
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  private cityService = inject(CityService);

  constructor() {
    effect(() => {
      const isInputDisabled = this.disabledInput();
      this.disabled.set(isInputDisabled);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    if (this.citiesListInput() === null) {
      this.loadCities();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stateId']) {
      if (this.citiesListInput() === null) {
        this.loadCities();
      }
    }
  }

  async loadCities(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const sid = this.stateId();
      if (sid) {
        // En un caso real habría un método getByState(sid). Si no existe, filtramos localmente o usamos query params.
        const res = await this.cityService.getAll({ state_id: sid }, { enabled: true, key: `CITIES_${sid}` }, forceRefresh);
        this._internalList.set(res.data || []);
      } else {
        const res = await this.cityService.getAll(undefined, { enabled: true, key: 'CITIES_ALL' }, forceRefresh);
        this._internalList.set(res.data || []);
      }
    } catch (err) {
      console.error('Error al cargar ciudades:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    this.onReload.emit();
    if (this.citiesListInput() === null) {
      this.loadCities(true);
    }
  }

  citiesOptions = computed(() => {
    return this.citiesList().map(c => ({
      value: c.id,
      label: c.city,
      raw: c,
      iconKey: 'iconLocation'
    }));
  });

  handleSelectionChange(selectedOption: any | null) {
    const selectedId = selectedOption ? selectedOption.value : '';
    this.value.set(selectedId);
    this.onChange(selectedId);
    this.onTouched();
    
    if (selectedId) {
      const obj = this.citiesList().find(c => c.id === selectedId) || null;
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
