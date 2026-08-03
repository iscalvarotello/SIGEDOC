import { Component, input, output, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { KbdBadgeComponent } from '@system-shared/ui/kbd-badge/kbd-badge.component';

@Component({
  selector: 'search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, KbdBadgeComponent],
  template: `
    <div class="relative w-full" [ngClass]="containerClasses()">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2">
        <icon icon="SearchOutline" class="w-5 h-5 text-gray-500"></icon>
      </span>
      
      <input 
        #inputElement
        type="text" 
        [placeholder]="placeholder()" 
        [ngModel]="value()"
        (ngModelChange)="onValueChange($event)"
        [disabled]="disabled()"
        class="dark:bg-white/[0.03] dark:text-white/90 dark:border-gray-800 dark:focus:border-theme-primary/20 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 transition-colors"
        [ngClass]="inputClasses()" />
        
      @if (commands()) {
        <kbd-badge [commands]="commands()!" customClasses="absolute right-2.5 top-1/2 -translate-y-1/2"></kbd-badge>
      }
    </div>
  `,
  host: {
    'class': 'block w-full'
  }
})
export class SearchInputComponent {
  value = input<string>('');
  placeholder = input<string>('Buscar...');
  commands = input<string | null>(null);
  disabled = input<boolean>(false);
  
  // Para ajustar el width del contenedor si se necesita (ej: max-w-[340px] xl:w-[340px])
  containerClasses = input<string>('');

  valueChanged = output<string>();

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  onValueChange(val: string) {
    this.valueChanged.emit(val);
  }

  inputClasses = computed(() => {
    let classes = '';
    // Si hay comandos, damos más padding derecho para que el texto no se monte en el badge
    if (this.commands()) {
      classes += 'pr-16 ';
    } else {
      classes += 'pr-4 ';
    }
    return classes.trim();
  });

  focus() {
    this.inputElement?.nativeElement.focus();
  }
}
