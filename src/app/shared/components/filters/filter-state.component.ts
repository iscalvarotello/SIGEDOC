import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../blocks/CORE_DB/location/countries/country.service';
import { CountryDTO } from '../../../blocks/CORE_DB/location/countries/country.dto';
import { StateService } from '../../../blocks/CORE_DB/location/states/state.service';
import { StateDTO } from '../../../blocks/CORE_DB/location/states/state.dto';
import { SearchableSelectComponent, SelectOption } from './searchable-select.component';
import { SVG_ICONS } from '../../icons/svg-icons';

@Component({
  selector: 'app-filter-state',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  template: `
    <div class="flex flex-row gap-3 w-full">
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
    </div>
  `
})
export class FilterStateComponent implements OnInit {
  private countryService = inject(CountryService);
  private stateService = inject(StateService);

  @Output() onStateSelect = new EventEmitter<{ stateId: string, contextText: string }>();

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

  // Opciones para los Selects
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
        this.onStateSelect.emit({ stateId: '', contextText: '' });
      }
    } catch (error) {
      console.error('Error cargando estados', error);
      this.onStateSelect.emit({ stateId: '', contextText: '' });
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
        contextText: `el Estado de ${state.name} del País de ${country.name}` 
      });
    } else {
      this.onStateSelect.emit({ stateId: '', contextText: '' });
    }
  }
}
