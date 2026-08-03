import { Component, OnInit, forwardRef, inject, signal, computed, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { CountryService } from '@location/countries/country.service';
import { CountryDTO } from '@location/countries/country.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="countriesOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="value()">
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.name">
            {{ opt.raw.emoji || '🌍' }} {{ opt.raw.name }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">ISO2: </span>
            <span class="text-theme-secondary font-semibold truncate block" [title]="opt.raw.iso2 || 'N/A'">{{ opt.raw.iso2 || 'N/A' }}</span>
            <span class="shrink-0">•</span>
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">Prefijo: </span>
            <span class="text-gray-600 dark:text-gray-300 font-semibold truncate block">
              +{{ opt.raw.phonecode || 'N/A' }}
            </span>
          </span>
        </div>
      </ng-template>
    </app-listbox>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class CountrySelectComponent implements OnInit, ControlValueAccessor {
  icons = SVG_ICONS;
  
  // Custom Inputs
  countriesListInput = input<CountryDTO[] | null>(null, { alias: 'countriesList' });
  placeholder = input<string>('Buscar país...');
  disabledInput = input<boolean>(false);
  showReload = input<boolean>(true);
  isLoadingInput = input<boolean | null>(null, { alias: 'isLoading' });
  
  // Outputs
  onSelect = output<CountryDTO | null>();
  onClear = output<void>();
  onReload = output<void>();

  // State
  private _internalList = signal<CountryDTO[]>([]);
  private _internalLoading = signal<boolean>(false);
  
  // Computed (Hybrid Support)
  countriesList = computed(() => this.countriesListInput() !== null ? this.countriesListInput()! : this._internalList());
  isLoading = computed(() => this.isLoadingInput() !== null ? this.isLoadingInput()! : this._internalLoading());
  
  // Value Accessor
  value = signal<string>('');
  disabled = signal<boolean>(false);
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  private countryService = inject(CountryService);

  constructor() {
    effect(() => {
      const isInputDisabled = this.disabledInput();
      this.disabled.set(isInputDisabled);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    if (this.countriesListInput() === null) {
      this.loadCountries();
    }
  }

  async loadCountries(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const res = await this.countryService.getAll(undefined, { enabled: true, key: 'COUNTRIES' }, forceRefresh);
      this._internalList.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar países:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    this.onReload.emit();
    if (this.countriesListInput() === null) {
      this.loadCountries(true);
    }
  }

  countriesOptions = computed(() => {
    return this.countriesList().map(c => ({
      value: c.id,
      label: c.name,
      raw: c,
      iconKey: 'iconWorld'
    }));
  });

  handleSelectionChange(selectedOption: any | null) {
    const selectedId = selectedOption ? selectedOption.value : '';
    this.value.set(selectedId);
    this.onChange(selectedId);
    this.onTouched();
    
    if (selectedId) {
      const obj = this.countriesList().find(c => c.id === selectedId) || null;
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
