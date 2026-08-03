import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericApiService } from '@core/services/generic-api.service';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';

import { SupplierSelectComponent } from '@workspace-shared/components/selects/supplier-select/supplier-select.component';

@Component({
  selector: 'app-filter-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierSelectComponent],
  template: `
    <div class="relative w-full min-w-[250px]">
      <app-supplier-select
        [suppliersList]="suppliers"
        [isLoading]="isLoading"
        [placeholder]="placeholder"
        [selectedId]="selectedSupplierId"
        (onSelect)="onSupplierChange($event?.id || '')"
        (onClear)="onSupplierChange('')">
      </app-supplier-select>
    </div>
  `
})
export class FilterSupplierComponent implements OnInit {
  private genericApi = inject(GenericApiService);

  @Input() type: string = ''; // Ej. 'Fuel', 'Service', 'Material'
  @Input() placeholder: string = 'Seleccione Proveedor';
  @Input() value: string = '';
  
  @Output() onSupplierSelect = new EventEmitter<{id: string, contextText: string}>();

  suppliers: any[] = [];
  selectedSupplierId: string = '';
  isLoading: boolean = true;

  async ngOnInit() {
    this.selectedSupplierId = this.value;
    await this.loadSuppliers();
  }

  async loadSuppliers() {
    try {
      this.isLoading = true;
      const queryParams = this.type ? { type: this.type } : undefined;
      
      this.suppliers = await this.genericApi.getDropdownOptions(
        ENDPOINT_KEYS.SUPPLIERS, 
        queryParams,
        { enabled: true, ttlMinutes: 30 }
      );
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSupplierChange(id: string) {
    this.selectedSupplierId = id;
    const defaultSupplier = this.suppliers.find(s => s.id == id);
    if (defaultSupplier) {
      const contextText = defaultSupplier ? defaultSupplier.name : '';
      this.onSupplierSelect.emit({ id: defaultSupplier.id, contextText: `el Proveedor ${contextText}` });
    } else {
      this.onSupplierSelect.emit({ id: '', contextText: '' });
    }
  }
}
