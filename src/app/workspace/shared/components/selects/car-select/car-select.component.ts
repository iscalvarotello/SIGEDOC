import { Component, input, output, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { CarService } from '@logistica/cars/car.service';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-select',
  standalone: true,
  imports: [CommonModule, ListboxComponent, FormsModule],
  template: `
    <app-listbox
      [options]="carsOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class CarSelectComponent implements OnInit {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  
  // Soporte híbrido
  carsListInput = input<any[] | null>(null, { alias: 'carsList' });
  private _internalList = signal<any[]>([]);
  carsList = computed(() => this.carsListInput() !== null ? this.carsListInput()! : this._internalList());

  placeholder = input<string>('Buscar vehículo...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(true);
  
  // Soporte híbrido para isLoading
  isLoadingInput = input<boolean | null>(null, { alias: 'isLoading' });
  private _internalLoading = signal<boolean>(false);
  isLoading = computed(() => this.isLoadingInput() !== null ? this.isLoadingInput()! : this._internalLoading());

  onSelect = output<any>();
  onClear = output<void>();
  onReload = output<void>();

  searchQuery = signal<string>('');
  isDropdownOpen = signal<boolean>(false);

  private carService = inject(CarService);

  constructor() {
    // Sincronizar el objeto seleccionado inicialmente y cuando cambia el selectedId
    effect(() => {
      const id = this.selectedId();
      const list = this.carsList();
      if (id && list.length > 0) {
        const car = list.find(c => c.id === id);
        if (car) {
          setTimeout(() => {
            this.onSelect.emit(car);
          });
        }
      }
    });
  }

  ngOnInit() {
    if (this.carsListInput() === null) {
      this.loadCars();
    }
  }

  async loadCars(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const res = await this.carService.getAll(undefined, undefined, forceRefresh);
      this._internalList.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar vehículos en CarSelectComponent:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    if (this.carsListInput() === null) {
      this.loadCars(true);
    }
    this.onReload.emit();
  }

  carsOptions = computed(() => {
    return this.carsList().map(car => ({
      value: car.id,
      label: `${car.marca} ${car.modelo} ${car.placas ? '[' + car.placas + ']' : ''}`,
      raw: car,
      iconKey: 'Gasolinera'
    }));
  });

  handleSelectionChange(opt: any) {
    if (opt) {
      this.onSelect.emit(opt.raw);
    } else {
      this.onClear.emit();
    }
  }
}
