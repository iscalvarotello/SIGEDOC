import { Component, input, output, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SupplierService } from '@organization/suppliers/supplier.service';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-select',
  standalone: true,
  imports: [CommonModule, ListboxComponent, FormsModule],
  template: `
    <app-listbox
      [options]="suppliersOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.razon_social || opt.raw.name">
            {{ opt.raw.razon_social || opt.raw.name }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">RFC: </span>
            <span class="text-theme-secondary font-semibold truncate block" [title]="opt.raw.rfc || 'N/A'">{{ opt.raw.rfc || 'N/A' }}</span>
          </span>
        </div>
      </ng-template>
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class SupplierSelectComponent implements OnInit {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  
  // Soporte híbrido
  suppliersListInput = input<any[] | null>(null, { alias: 'suppliersList' });
  private _internalList = signal<any[]>([]);
  suppliersList = computed(() => this.suppliersListInput() !== null ? this.suppliersListInput()! : this._internalList());

  placeholder = input<string>('Buscar proveedor por nombre o RFC...');
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

  private supplierService = inject(SupplierService);

  constructor() {
    // Sincronizar el objeto seleccionado inicialmente y cuando cambia el selectedId
    effect(() => {
      const id = this.selectedId();
      const list = this.suppliersList();
      if (id && list.length > 0) {
        const sup = list.find(s => s.id === id);
        if (sup) {
          setTimeout(() => {
            this.onSelect.emit(sup);
          });
        }
      }
    });
  }

  ngOnInit() {
    if (this.suppliersListInput() === null) {
      this.loadSuppliers();
    }
  }

  async loadSuppliers(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const res = await this.supplierService.getAll({ active: true }, undefined, forceRefresh);
      this._internalList.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar proveedores en SupplierSelectComponent:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    if (this.suppliersListInput() === null) {
      this.loadSuppliers(true);
    }
    this.onReload.emit();
  }

  suppliersOptions = computed(() => {
    return this.suppliersList().map(sup => ({
      value: sup.id,
      label: `${sup.razon_social || sup.name} ${sup.rfc ? '(' + sup.rfc + ')' : ''}`,
      raw: sup,
      iconKey: 'Camion'
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
