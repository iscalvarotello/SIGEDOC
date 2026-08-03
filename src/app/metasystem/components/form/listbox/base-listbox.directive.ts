import { Directive, input, output, signal, computed, effect } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export interface ListboxOption {
  value: any;
  label: string;
  raw?: any; // Para inyectarlo en ng-templates personalizados
  iconKey?: string; // Nombre del icono en SVG_ICONS
}

@Directive()
export abstract class BaseListboxDirective implements ControlValueAccessor {
  // Configuración
  options = input<ListboxOption[]>([]);
  placeholder = input<string>('Seleccionar...');
  label = input<string>();
  showReload = input<boolean>(false);
  searchable = input<boolean>(false);
  isLoading = input<boolean>(false);
  disabledInput = input<boolean>(false);
  
  // Función personalizada de filtrado (opcional)
  customFilter = input<(opt: ListboxOption, query: string) => boolean>();

  // Eventos adicionales
  onReload = output<void>();
  onSelectionChange = output<ListboxOption | null>();

  // Estado interno
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedValue = signal<any>(null);
  isDisabled = signal<boolean>(false);

  // Computed: Opción seleccionada
  selectedOption = computed(() => {
    const val = this.selectedValue();
    if (val === null || val === undefined || val === '') return null;
    return this.options().find(opt => opt.value === val) || null;
  });

  // Computed: Label a mostrar cuando está cerrado
  selectedLabel = computed(() => {
    return this.selectedOption()?.label || '';
  });

  // Computed: Opciones filtradas
  filteredOptions = computed(() => {
    const query = this.normalizeStr(this.searchQuery());
    const allOptions = this.options();
    
    if (!query) {
       console.log('Listbox filteredOptions length:', allOptions.length);
       return allOptions;
    }

    const customFn = this.customFilter();
    let result = [];
    if (customFn) {
       result = allOptions.filter(opt => customFn(opt, query));
    } else {
       result = allOptions.filter(opt => this.normalizeStr(opt.label).includes(query));
    }
    console.log('Listbox filteredOptions length:', result.length);
    return result;
  });

  // Angular ControlValueAccessor callbacks
  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      if (this.disabledInput() !== undefined) {
        this.isDisabled.set(this.disabledInput());
      }
    }, { allowSignalWrites: true });
  }

  // --- Implementación de ControlValueAccessor ---
  writeValue(obj: any): void {
    this.selectedValue.set(obj);
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --- Acciones de UI ---
  openDropdown() {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
    this.searchQuery.set('');
  }

  closeDropdown() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.onTouched();
  }

  toggleDropdown() {
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  selectOption(opt: ListboxOption, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedValue.set(opt.value);
    this.onChange(opt.value);
    this.onSelectionChange.emit(opt);
    this.closeDropdown();
  }

  clearSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedValue.set(null);
    this.onChange(null);
    this.onSelectionChange.emit(null);
    this.searchQuery.set('');
  }

  handleReload(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.onReload.emit();
  }

  // Utilidad centralizada para búsqueda segura
  protected normalizeStr(str: string): string {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
