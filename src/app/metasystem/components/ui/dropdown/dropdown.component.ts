import { CommonModule } from '@angular/common';
import { Component, input, output, ElementRef, ViewChild, AfterViewInit, OnDestroy, computed } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './dropdown.component.html',
  imports: [CommonModule]
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  isOpen = input<boolean>(false);
  close = output<void>();
  
  // Customization inputs
  width = input<string>('w-[260px]');
  padding = input<string>('p-3');
  position = input<string>('right-0');
  marginTop = input<string>('mt-2'); // Permite ajustar el margen superior (ej: mt-[17px])
  customClasses = input<string>(''); // Para cualquier override rápido extra que no encaje

  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLDivElement>;

  // Orquestación de clases
  containerClasses = computed(() => {
    const base = 'absolute z-40 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark';
    return `${base} ${this.position()} ${this.marginTop()} ${this.width()} ${this.padding()} ${this.customClasses()}`.trim();
  });

  private handleClickOutside = (event: MouseEvent) => {
    if (
      this.isOpen() &&
      this.dropdownRef &&
      this.dropdownRef.nativeElement &&
      !this.dropdownRef.nativeElement.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest('.dropdown-toggle')
    ) {
      this.close.emit();
    }
  };

  ngAfterViewInit() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
}