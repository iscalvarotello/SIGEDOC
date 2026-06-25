import { Component, EventEmitter, OnInit, Output, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../blocks/CORE_DB/location/countries/country.service';
import { CountryDTO } from '../../../blocks/CORE_DB/location/countries/country.dto';
import { StateService } from '../../../blocks/CORE_DB/location/states/state.service';
import { StateDTO } from '../../../blocks/CORE_DB/location/states/state.dto';
import { CityService } from '../../../blocks/CORE_DB/location/cities/city.service';
import { CityDTO } from '../../../blocks/CORE_DB/location/cities/city.dto';
import { SearchableSelectComponent, SelectOption } from './searchable-select.component';
import { SVG_ICONS } from '../../icons/svg-icons';

@Component({
  selector: 'app-filter-city',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  template: `
    <div class="flex gap-3 w-full" [ngClass]="{'flex-col': layout() === 'vertical', 'flex-row': layout() === 'horizontal'}">
      <!-- Selector de País -->
      <div class="flex-1">
        <app-searchable-select
          [options]="countryOptions()"
          [value]="selectedCountryId()"
          [isLoading]="isLoadingCountries()"
          placeholder="País"
          [leftIconHtml]="icons.iconWorld"
          (onSelect)="onCountryChange($event)">
        </app-searchable-select>
      </div>

      <!-- Selector de Estado -->
      <div class="flex-1">
        <app-searchable-select
          [options]="stateOptions()"
          [value]="selectedStateId()"
          [isLoading]="isLoadingStates()"
          [disabled]="!selectedCountryId()"
          placeholder="Estado o Región"
          [leftIconHtml]="icons.iconMap"
          (onSelect)="onStateChange($event)">
        </app-searchable-select>
      </div>

      <!-- Selector de Ciudad -->
      <div class="flex-1">
        <app-searchable-select
          [options]="cityOptions()"
          [value]="selectedCityId()"
          [isLoading]="isLoadingCities()"
          [disabled]="!selectedStateId()"
          placeholder="Ciudad o Municipio"
          [leftIconHtml]="icons.iconCity"
          (onSelect)="onCityChange($event)">
        </app-searchable-select>
      </div>
    </div>
  `
})
export class FilterCityComponent implements OnInit {
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private cityService = inject(CityService);

  @Output() onCountrySelect = new EventEmitter<{ countryId: string }>();
  @Output() onStateSelect = new EventEmitter<{ stateId: string }>();
  @Output() onCitySelect = new EventEmitter<{ cityId: string }>();

  constructor() {
    // Sincronizar inputs asíncronos (cuando hacemos Edit y los datos llegan después del ngOnInit)
    effect(() => {
      const cId = this.initialCountryId();
      if (cId && this.countries().length > 0 && this.selectedCountryId() !== cId) {
        this.selectedCountryId.set(cId);
        this.loadStates(cId, false);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const sId = this.initialStateId();
      if (sId && this.states().length > 0 && this.selectedStateId() !== sId) {
        this.selectedStateId.set(sId);
        this.loadCities(sId, false);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const cityId = this.initialCityId();
      if (cityId && this.cities().length > 0 && this.selectedCityId() !== cityId) {
        this.selectedCityId.set(cityId);
      }
    }, { allowSignalWrites: true });
  }

  // Inputs
  layout = input<'horizontal' | 'vertical'>('horizontal');
  initialCountryId = input<string>('');
  initialStateId = input<string>('');
  initialCityId = input<string>('');

  // Señales de País
  countries = signal<CountryDTO[]>([]);
  isLoadingCountries = signal<boolean>(true);
  selectedCountryId = signal<string>('');

  // Señales de Estado
  states = signal<StateDTO[]>([]);
  isLoadingStates = signal<boolean>(false);
  selectedStateId = signal<string>('');

  // Señales de Ciudad
  cities = signal<CityDTO[]>([]);
  isLoadingCities = signal<boolean>(false);
  selectedCityId = signal<string>('');
  
  // Iconos SVG Centralizados
  icons = SVG_ICONS;

  // Opciones
  countryOptions = computed<SelectOption[]>(() => {
    return this.countries().map(c => ({
      id: c.id,
      label: c.name,
      icon: c.emoji || '🏳️',
      searchTerms: `\${c.iso2} \${c.fullName}`.toLowerCase()
    }));
  });

  stateOptions = computed<SelectOption[]>(() => {
    return this.states().map(s => ({
      id: s.id,
      label: s.name,
      searchTerms: s.state_code
    }));
  });

  cityOptions = computed<SelectOption[]>(() => {
    return this.cities().map(c => ({
      id: c.id,
      label: c.city
    }));
  });

  async ngOnInit() {
    await this.loadCountries();
  }

  async loadCountries() {
    this.isLoadingCountries.set(true);
    try {
      const response = await this.countryService.getAll(undefined, { enabled: true, key: 'COUNTRIES' });
      const list = response.data || [];
      this.countries.set(list);

      if (list.length > 0) {
        let selectedId = this.initialCountryId() || '';
        if (!selectedId || !list.find((c: CountryDTO) => c.id === selectedId)) {
          selectedId = (list.find((c: CountryDTO) => c.fix === true) || list[0]).id;
        }
        
        this.selectedCountryId.set(selectedId);
        this.onCountrySelect.emit({ countryId: selectedId });
        await this.loadStates(selectedId, true);
      }
    } catch (error) {
      console.error('Error cargando países', error);
    } finally {
      this.isLoadingCountries.set(false);
    }
  }

  async loadStates(countryId: string, emit = true) {
    this.isLoadingStates.set(true);
    this.states.set([]);
    this.selectedStateId.set('');
    
    // Al cambiar estado, resetear ciudades
    this.cities.set([]);
    this.selectedCityId.set('');

    try {
      const response = await this.stateService.executeSpecialRoute('byCountry', { countryId });
      const list = response.data || [];
      this.states.set(list);

      if (list.length > 0) {
        let selectedId = this.initialStateId() || '';
        // Solo usamos initialStateId si pertenece a esta carga, si no, lo limpiamos para próximas selecciones
        if (!selectedId || !list.find((s: StateDTO) => s.id === selectedId)) {
          selectedId = (list.find((s: StateDTO) => s.fix === true) || list[0]).id;
        }

        this.selectedStateId.set(selectedId);
        if (emit) this.onStateSelect.emit({ stateId: selectedId });
        await this.loadCities(selectedId, emit);
      } else {
        if (emit) {
          this.onStateSelect.emit({ stateId: '' });
          this.onCitySelect.emit({ cityId: '' });
        }
      }
    } catch (error) {
      console.error('Error cargando estados', error);
      if (emit) this.onCitySelect.emit({ cityId: '' });
    } finally {
      this.isLoadingStates.set(false);
    }
  }

  async loadCities(stateId: string, emit = true) {
    this.isLoadingCities.set(true);
    this.cities.set([]);
    this.selectedCityId.set('');

    try {
      const response = await this.cityService.executeSpecialRoute('byState', { stateId });
      const list = response.data || [];
      this.cities.set(list);

      if (list.length > 0) {
        let selectedId = this.initialCityId() || '';
        if (!selectedId || !list.find((c: CityDTO) => c.id === selectedId)) {
          selectedId = list[0].id;
        }

        this.selectedCityId.set(selectedId);
        if (emit) this.onCitySelect.emit({ cityId: selectedId });
      } else {
        if (emit) this.onCitySelect.emit({ cityId: '' });
      }
    } catch (error) {
      console.error('Error cargando ciudades', error);
      if (emit) this.onCitySelect.emit({ cityId: '' });
    } finally {
      this.isLoadingCities.set(false);
    }
  }

  async onCountryChange(countryId: string) {
    if (this.selectedCountryId() !== countryId) {
      this.selectedCountryId.set(countryId);
      this.onCountrySelect.emit({ countryId });
      await this.loadStates(countryId, true);
    }
  }

  async onStateChange(stateId: string) {
    if (this.selectedStateId() !== stateId) {
      this.selectedStateId.set(stateId);
      this.onStateSelect.emit({ stateId });
      await this.loadCities(stateId, true);
    }
  }

  onCityChange(cityId: string) {
    if (this.selectedCityId() !== cityId) {
      this.selectedCityId.set(cityId);
      this.onCitySelect.emit({ cityId });
    }
  }
}
