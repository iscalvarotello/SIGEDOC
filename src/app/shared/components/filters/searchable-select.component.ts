import { Component, EventEmitter, Input, Output, HostListener, ElementRef, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  id: string;
  label: string;
  icon?: string; // Emoji o HTML
  searchTerms?: string; // Texto oculto extra para ayudar en la búsqueda
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full min-w-[220px]" [class.z-50]="isOpen()">
      
      <!-- Trigger Button -->
      <button 
        type="button"
        (click)="toggleDropdown()"
        [disabled]="disabled || isLoading"
        class="w-full relative flex items-center pl-10 pr-10 py-2.5 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#691C32] focus:border-[#691C32] sm:text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition duration-150 ease-in-out cursor-pointer"
        [ngClass]="{'opacity-60 cursor-wait': isLoading, 'opacity-50 cursor-not-allowed': disabled && !isLoading}"
      >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ng-container *ngIf="leftIconHtml">
             <span class="text-gray-400 dark:text-gray-500 flex items-center" [innerHTML]="leftIconHtml"></span>
          </ng-container>
          <ng-container *ngIf="!leftIconHtml">
             <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
             </svg>
          </ng-container>
        </div>
        
        <span class="block truncate font-medium">
          <ng-container *ngIf="isLoading">Cargando...</ng-container>
          <ng-container *ngIf="!isLoading && selectedOption">
            {{ selectedOption.icon || '' }} &nbsp; {{ selectedOption.label }}
          </ng-container>
          <ng-container *ngIf="!isLoading && !selectedOption">
            <span class="text-gray-400">{{ placeholder }}</span>
          </ng-container>
        </span>
        
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>

      <!-- Dropdown Menu -->
      <div *ngIf="isOpen()" 
           class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-[300px] rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden flex flex-col focus:outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
        
        <!-- Search Input -->
        <div class="sticky top-0 z-50 bg-white dark:bg-gray-800 px-2 py-2 border-b border-gray-100 dark:border-gray-700">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              [placeholder]="'Buscar ' + placeholder.toLowerCase() + '...'" 
              class="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#691C32]/50 dark:bg-gray-700 dark:text-white transition-all shadow-sm"
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              (click)="$event.stopPropagation()"
              #searchInput
            >
          </div>
        </div>
        
        <!-- Options List -->
        <div *ngIf="filteredOptions.length === 0" class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
          No se encontraron coincidencias.
        </div>
        
        <ul class="flex-1 overflow-y-auto">
          <li *ngFor="let option of filteredOptions" 
              (click)="selectOption(option.id)"
              class="cursor-pointer select-none relative py-2.5 pl-3 pr-9 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
              [class.bg-[#691C32]/5]="option.id === value"
              [class.dark:bg-[#691C32]/20]="option.id === value"
              [class.text-[#691C32]]="option.id === value"
              [class.font-medium]="option.id === value"
          >
            <div class="flex items-center">
              <span class="truncate">{{ option.icon || '' }} &nbsp; {{ option.label }}</span>
            </div>
            
            <span *ngIf="option.id === value" class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#691C32] dark:text-white">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class SearchableSelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() value: string = '';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'Seleccionar...';
  @Input() leftIconHtml: string = '';

  @Output() onSelect = new EventEmitter<string>();

  private eRef = inject(ElementRef);
  
  isOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  get selectedOption() {
    return this.options.find(o => o.id === this.value) || null;
  }

  get filteredOptions() {
    const normalizeStr = (str: string) => {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    };

    const term = normalizeStr(this.searchTerm());
    if (!term) return this.options;
    
    return this.options.filter(o => 
      normalizeStr(o.label).includes(term) || 
      (o.searchTerms && normalizeStr(o.searchTerms).includes(term))
    );
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    if (this.isLoading || this.disabled) return;
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.searchTerm.set('');
    }
  }

  selectOption(id: string) {
    if (id !== this.value) {
      this.onSelect.emit(id);
    }
    this.isOpen.set(false);
  }
}
