import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '@location/countries/country.service';
import { CountryDTO } from '@location/countries/country.dto';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';

import { CountrySelectComponent } from '@workspace-shared/components/selects/country-select/country-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-country',
  standalone: true,
  imports: [CommonModule, FormsModule, CountrySelectComponent],
  template: `
    <app-country-select
      [countriesList]="countries()"
      [ngModel]="selectedCountryId()"
      [isLoading]="isLoading()"
      placeholder="País"
      (onSelect)="selectCountry($event?.id || '')">
    </app-country-select>
  `
})
export class FilterCountryComponent implements OnInit {
  private countryService = inject(CountryService);

  @Output() onCountrySelect = new EventEmitter<{ countryId: string }>();

  countries = signal<CountryDTO[]>([]);
  isLoading = signal<boolean>(true);
  selectedCountryId = signal<string>('');
  
  icons = SVG_ICONS;



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
