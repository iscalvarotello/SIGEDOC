import { Component, EventEmitter, OnInit, Output, inject, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '@location/countries/country.service';
import { CountryDTO } from '@location/countries/country.dto';
import { StateService } from '@location/states/state.service';
import { StateDTO } from '@location/states/state.dto';
import { CityService } from '@location/cities/city.service';
import { CityDTO } from '@location/cities/city.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

import { CountrySelectComponent } from '@workspace-shared/components/selects/country-select/country-select.component';
import { StateSelectComponent } from '@workspace-shared/components/selects/state-select/state-select.component';
import { CitySelectComponent } from '@workspace-shared/components/selects/city-select/city-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-city',
  standalone: true,
  imports: [CommonModule, FormsModule, CountrySelectComponent, StateSelectComponent, CitySelectComponent],
  template: `
    <div class="flex gap-3 w-full" [ngClass]="{'flex-col': layout() === 'vertical', 'flex-row': layout() === 'horizontal'}">
      <div class="flex-1">
        <app-country-select
          [countriesList]="countries()"
          [ngModel]="selectedCountryId()"
          [isLoading]="isLoadingCountries()"
          placeholder="País"
          (onSelect)="onCountryChange($event?.id || '')">
        </app-country-select>
      </div>

      <div class="flex-1">
        <app-state-select
          [statesList]="states()"
          [ngModel]="selectedStateId()"
          [isLoading]="isLoadingStates()"
          [disabledInput]="!selectedCountryId()"
          placeholder="Estado o Región"
          (onSelect)="onStateChange($event?.id || '')">
        </app-state-select>
      </div>

      <div class="flex-1">
        <app-city-select
          [citiesList]="cities()"
          [ngModel]="selectedCityId()"
          [isLoading]="isLoadingCities()"
          [disabledInput]="!selectedStateId()"
          placeholder="Ciudad o Municipio"
          (onSelect)="onCityChange($event?.id || '')">
        </app-city-select>
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

  // Inputs
  isNew = input<boolean>(true);
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
  
  icons = SVG_ICONS;

  constructor() {
    // Solo reaccionamos si el formGroup inyecta nuevos valores y NO estamos cargando esa capa
    effect(() => {
      const cId = this.initialCountryId();
      if (cId && cId !== this.selectedCountryId() && !this.isLoadingCountries()) {
        this.selectedCountryId.set(cId);
        this.loadStates(cId, false).then();
      }
    });

    effect(() => {
      const sId = this.initialStateId();
      if (sId && sId !== this.selectedStateId() && !this.isLoadingStates()) {
        this.selectedStateId.set(sId);
        this.loadCities(sId, false).then();
      }
    });

    effect(() => {
      const cityId = this.initialCityId();
      if (cityId && cityId !== this.selectedCityId() && !this.isLoadingCities()) {
        this.selectedCityId.set(cityId);
      }
    });
  }

  async ngOnInit() {
    await this.loadCountries();
  }

  async loadCountries() {
    this.isLoadingCountries.set(true);
    try {
      const response = await this.countryService.getAll(undefined, { enabled: true, key: 'COUNTRIES' });
      const list = response.data || [];
      this.countries.set(list);

      const cId = this.initialCountryId();
      if (!this.isNew()) {
        // Modo Edición: NUNCA emitimos fallback. Si ya hay cId (ej. cargó rápido), lo usamos.
        if (cId) {
          this.selectedCountryId.set(cId);
          await this.loadStates(cId, false);
        }
      } else {
        // Modo Creación (isNew = true): Autoseleccionamos el default y SÍ emitimos
        if (list.length > 0 && !cId) {
          const defaultId = (list.find((c: CountryDTO) => c.fix === true) || list[0]).id;
          this.selectedCountryId.set(defaultId);
          this.onCountrySelect.emit({ countryId: defaultId });
          await this.loadStates(defaultId, true);
        } else if (cId) {
          this.selectedCountryId.set(cId);
          await this.loadStates(cId, false);
        }
      }
    } catch (error) {
      console.error('Error cargando países', error);
    } finally {
      this.isLoadingCountries.set(false);
    }
  }

  async loadStates(countryId: string, autoSelectAndEmit = false) {
    this.isLoadingStates.set(true);
    
    // Limpiamos visualmente los hijos (sin emitir para no corromper el form en background)
    this.states.set([]);
    this.selectedStateId.set('');
    this.cities.set([]);
    this.selectedCityId.set('');

    try {
      const response = await this.stateService.executeSpecialRoute('byCountry', { countryId });
      
      // ABORTAR si el país cambió mientras cargábamos
      if (this.selectedCountryId() !== countryId) return;

      const list = response.data || [];
      this.states.set(list);

      const sId = this.initialStateId();
      if (!autoSelectAndEmit && sId) {
        // Modo Edición (o sincronización silenciosa): Respetamos el ID. NO emitimos.
        this.selectedStateId.set(sId);
        await this.loadCities(sId, false);
      } else if (autoSelectAndEmit) {
        // Interacción del Usuario (o cascada de Creación): Autoseleccionamos y SÍ emitimos
        if (list.length > 0) {
          const defaultId = (list.find((s: StateDTO) => s.fix === true) || list[0]).id;
          this.selectedStateId.set(defaultId);
          this.onStateSelect.emit({ stateId: defaultId });
          await this.loadCities(defaultId, true);
        } else {
          this.onStateSelect.emit({ stateId: '' });
          this.onCitySelect.emit({ cityId: '' });
        }
      }
    } catch (error) {
      console.error('Error cargando estados', error);
    } finally {
      this.isLoadingStates.set(false);
    }
  }

  async loadCities(stateId: string, autoSelectAndEmit = false) {
    this.isLoadingCities.set(true);
    this.cities.set([]);
    this.selectedCityId.set('');

    try {
      const response = await this.cityService.executeSpecialRoute('byState', { stateId });

      // ABORTAR si el estado cambió mientras cargábamos
      if (this.selectedStateId() !== stateId) return;

      const list = response.data || [];
      this.cities.set(list);

      const cId = this.initialCityId();
      if (!autoSelectAndEmit && cId) {
        // Modo Edición: Respetamos el ID. NO emitimos.
        this.selectedCityId.set(cId);
      } else if (autoSelectAndEmit) {
        // Interacción del Usuario: Autoseleccionamos y SÍ emitimos
        if (list.length > 0) {
          const defaultId = list[0].id;
          this.selectedCityId.set(defaultId);
          this.onCitySelect.emit({ cityId: defaultId });
        } else {
          this.onCitySelect.emit({ cityId: '' });
        }
      }
    } catch (error) {
      console.error('Error cargando ciudades', error);
    } finally {
      this.isLoadingCities.set(false);
    }
  }

  // Interacciones directas del usuario desde el HTML (siempre autoSeleccionan hijos y emiten)
  async onCountryChange(countryId: string) {
    if (this.selectedCountryId() !== countryId) {
      this.selectedCountryId.set(countryId);
      this.onCountrySelect.emit({ countryId });
      
      // Limpiamos la emisión hacia el form para asegurar que no quede data vieja
      this.onStateSelect.emit({ stateId: '' });
      this.onCitySelect.emit({ cityId: '' });
      
      await this.loadStates(countryId, true);
    }
  }

  async onStateChange(stateId: string) {
    if (this.selectedStateId() !== stateId) {
      this.selectedStateId.set(stateId);
      this.onStateSelect.emit({ stateId });
      
      // Limpiamos la emisión hacia el form para asegurar que no quede data vieja
      this.onCitySelect.emit({ cityId: '' });

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
