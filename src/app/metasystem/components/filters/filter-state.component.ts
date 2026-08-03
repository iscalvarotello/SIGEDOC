import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '@location/countries/country.service';
import { CountryDTO } from '@location/countries/country.dto';
import { StateService } from '@location/states/state.service';
import { StateDTO } from '@location/states/state.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

import { CountrySelectComponent } from '@workspace-shared/components/selects/country-select/country-select.component';
import { StateSelectComponent } from '@workspace-shared/components/selects/state-select/state-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-state',
  standalone: true,
  imports: [CommonModule, FormsModule, CountrySelectComponent, StateSelectComponent],
  template: `
    <div class="flex flex-row gap-3 w-full">
      <!-- Selector de País -->
      <div class="flex-1">
        <app-country-select
          [countriesList]="countries()"
          [ngModel]="selectedCountryId()"
          [isLoading]="isLoadingCountries()"
          placeholder="País"
          (onSelect)="onCountryChange($event?.id || '')">
        </app-country-select>
      </div>

      <!-- Selector de Estado -->
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
    </div>
  `
})
export class FilterStateComponent implements OnInit {
  private countryService = inject(CountryService);
  private stateService = inject(StateService);

  @Output() onStateSelect = new EventEmitter<{ stateId: string, countryId: string, contextText: string }>();

  // Señales de País
  countries = signal<CountryDTO[]>([]);
  isLoadingCountries = signal<boolean>(true);
  selectedCountryId = signal<string>('');

  // Señales de Estado
  states = signal<StateDTO[]>([]);
  isLoadingStates = signal<boolean>(false);
  selectedStateId = signal<string>('');
  
  // Iconos SVG Centralizados
  icons = SVG_ICONS;



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
        let defaultCountry = list.find((c: CountryDTO) => c.fix === true);
        if (!defaultCountry) defaultCountry = list[0];
        
        this.selectedCountryId.set(defaultCountry.id);
        await this.loadStates(defaultCountry.id);
      }
    } catch (error) {
      console.error('Error cargando países', error);
    } finally {
      this.isLoadingCountries.set(false);
    }
  }

  async loadStates(countryId: string) {
    this.isLoadingStates.set(true);
    this.states.set([]);
    this.selectedStateId.set('');

    try {
      // Usar la ruta especial 'byCountry'
      const response = await this.stateService.executeSpecialRoute('byCountry', { countryId });
      const list = response.data || [];
      this.states.set(list);

      if (list.length > 0) {
        let defaultState = list.find((s: StateDTO) => s.fix === true);
        if (!defaultState) defaultState = list[0];
        
        this.onStateChange(defaultState.id);
      } else {
        // No hay estados, emitimos vacío
        this.onStateSelect.emit({ stateId: '', countryId: this.selectedCountryId(), contextText: '' });
      }
    } catch (error) {
      console.error('Error cargando estados', error);
      this.onStateSelect.emit({ stateId: '', countryId: this.selectedCountryId(), contextText: '' });
    } finally {
      this.isLoadingStates.set(false);
    }
  }

  async onCountryChange(countryId: string) {
    if (this.selectedCountryId() !== countryId) {
      this.selectedCountryId.set(countryId);
      await this.loadStates(countryId);
    }
  }

  onStateChange(stateId: string) {
    if (this.selectedStateId() !== stateId) {
      this.selectedStateId.set(stateId);
    }
    const state = this.states().find(s => s.id === stateId);
    const country = this.countries().find(c => c.id === this.selectedCountryId());
    
    if (state && country) {
      this.onStateSelect.emit({ 
        stateId, 
        countryId: country.id,
        contextText: `el Estado de ${state.name} del País de ${country.name}` 
      });
    } else {
      this.onStateSelect.emit({ stateId: '', countryId: this.selectedCountryId(), contextText: '' });
    }
  }
}
