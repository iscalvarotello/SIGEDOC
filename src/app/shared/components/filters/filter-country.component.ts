import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../blocks/CORE_DB/location/countries/country.service';
import { CountryDTO } from '../../../blocks/CORE_DB/location/countries/country.dto';
import { SearchableSelectComponent, SelectOption } from './searchable-select.component';
import { SVG_ICONS } from '../../icons/svg-icons';

@Component({
  selector: 'app-filter-country',
  standalone: true,
  imports: [CommonModule, SearchableSelectComponent],
  template: `
    <app-searchable-select
      [options]="selectOptions()"
      [value]="selectedCountryId()"
      [isLoading]="isLoading()"
      placeholder="País"
      [leftIconHtml]="icons.iconWorld"
      (onSelect)="selectCountry($event)">
    </app-searchable-select>
  `
})
export class FilterCountryComponent implements OnInit {
  private countryService = inject(CountryService);

  @Output() onCountrySelect = new EventEmitter<{ countryId: string }>();

  countries = signal<CountryDTO[]>([]);
  isLoading = signal<boolean>(true);
  selectedCountryId = signal<string>('');
  
  icons = SVG_ICONS;

  selectOptions = computed<SelectOption[]>(() => {
    return this.countries().map(c => ({
      id: c.id,
      label: c.name,
      icon: c.emoji || '🏳️',
      searchTerms: `\${c.iso2} \${c.fullName}`.toLowerCase()
    }));
  });

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      const cacheConfig = { enabled: true, key: 'COUNTRIES' };
      const response = await this.countryService.getAll(undefined, cacheConfig);
      
      const list = response.data || [];
      this.countries.set(list);

      // Auto-seleccionar el principal
      if (list.length > 0) {
        let defaultCountry = list.find((c: CountryDTO) => c.fix === true);
        if (!defaultCountry) {
          defaultCountry = list[0];
        }
        this.selectedCountryId.set(defaultCountry.id);
        this.onCountrySelect.emit({ countryId: defaultCountry.id });
      }
    } catch (error) {
      console.error('Error cargando países para el filtro', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectCountry(id: string) {
    if (id !== this.selectedCountryId()) {
      this.selectedCountryId.set(id);
      this.onCountrySelect.emit({ countryId: id });
    }
  }
}
