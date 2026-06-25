import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericApiService } from '../../../core/services/generic-api.service';
import { ENDPOINT_KEYS } from '../../../core/api/api-routes.config';

@Component({
  selector: 'app-filter-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full min-w-[250px]">
      <select 
        [(ngModel)]="selectedSupplierId"
        (ngModelChange)="onSupplierChange($event)"
        class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 transition-all appearance-none text-sm font-medium"
        [disabled]="isLoading">
        <option value="">{{ isLoading ? 'Cargando proveedores...' : placeholder }}</option>
        @for (supplier of suppliers; track supplier.id) {
          <option [value]="supplier.id">{{ supplier.name }} - {{ supplier.razon_social }}</option>
        }
      </select>
      
      <!-- Dropdown Icon -->
      <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        @if (isLoading) {
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        } @else {
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
        }
      </div>
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
