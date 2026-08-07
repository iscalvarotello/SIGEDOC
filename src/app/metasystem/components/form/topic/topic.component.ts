import { Component, forwardRef, inject, OnInit, signal, effect, ElementRef, ViewChild, HostListener, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { AreaService } from '@organization/areas/area.service';
import { SesionService } from '@services/sesion.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="relative w-full flex flex-col gap-2">
      <!-- Input de Texto -->
      <div 
        class="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:border-[#BC955C] focus-within:ring-1 focus-within:ring-[#BC955C] transition-all min-h-[42px]"
        (click)="focusInput()"
      >
        <input 
          #topicInput
          type="text" 
          class="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200 min-w-[100px] py-0.5 placeholder-gray-400"
          placeholder="Escriba un tema y presione Enter..."
          [(ngModel)]="inputText"
          (keydown)="onKeyDown($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />
        
        <!-- Flecha hacia abajo para indicar desplegable (opcional) -->
        <div class="pointer-events-none text-gray-400">
          <icon icon="FlechaAbajo" class="h-4.5 w-4.5"></icon>
        </div>
      </div>

      <!-- Menú Flotante de Sugerencias -->
      @if (showSuggestions() && filteredSuggestions().length > 0) {
        <ul 
          class="absolute z-50 w-full top-[46px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto"
          (mousedown)="$event.preventDefault()" 
        >
          @for (sugg of filteredSuggestions(); track sugg) {
            <li 
              class="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#BC955C]/10 hover:text-[#691C32] dark:hover:text-[#BC955C] cursor-pointer font-medium"
              (click)="selectSuggestion(sugg)"
            >
              {{ sugg }}
            </li>
          }
        </ul>
      }

      <!-- Tapete de Chips (Temas Seleccionados) -->
      @if (selectedTopics().length > 0) {
        <div class="flex flex-wrap items-center gap-2 mt-1">
          @for (topic of selectedTopics(); track topic) {
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#BC955C]/10 text-[#691C32] dark:text-[#BC955C] border border-[#BC955C]/30">
              {{ topic }}
              <button 
                type="button" 
                class="ml-1 text-[#691C32]/70 hover:text-[#691C32] dark:text-[#BC955C]/70 dark:hover:text-[#BC955C] focus:outline-none"
                (click)="removeTopic(topic); $event.stopPropagation()"
              >
                <icon icon="Cross" class="w-3 h-3"></icon>
              </button>
            </span>
          }
        </div>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TopicComponent),
      multi: true
    }
  ]
})
export class TopicComponent implements ControlValueAccessor, OnInit {
  private _areaService = inject(AreaService);
  private _session = inject(SesionService);

  @ViewChild('topicInput') topicInput!: ElementRef<HTMLInputElement>;

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  selectedTopics = signal<string[]>([]);
  inputText = signal<string>('');
  
  availableSuggestions = signal<string[]>([]);
  showSuggestions = signal<boolean>(false);

  // Computado para filtrar sugerencias que no estén ya seleccionadas y que coincidan con el texto
  filteredSuggestions = computed(() => {
    const text = this.inputText().toLowerCase().trim();
    const selected = this.selectedTopics();
    const available = this.availableSuggestions();
    
    return available.filter(sugg => 
      !selected.includes(sugg) && sugg.toLowerCase().includes(text)
    );
  });

  constructor() {}

  ngOnInit() {
    this.loadSuggestions();
  }

  async loadSuggestions() {
    const areaId = this._session.activeAdscription()?.id_area;
    if (areaId) {
      try {
        const temas = await this._areaService.getTemas(areaId);
        this.availableSuggestions.set(temas || []);
      } catch (e) {
        console.error('Error loading topics', e);
      }
    }
  }

  // ==== CVA Methods ====
  writeValue(obj: any): void {
    if (typeof obj === 'string') {
      const arr = obj.split(',').map(t => t.trim()).filter(t => t.length > 0);
      this.selectedTopics.set(arr);
    } else {
      this.selectedTopics.set([]);
    }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {
    // Si queremos deshabilitar, podemos bindiar isDisabled al input
  }

  private notifyChange() {
    const csv = this.selectedTopics().join(', ');
    this.onChange(csv);
    this.onTouched();
  }
  // =====================

  private blurTimeout: any;

  focusInput() {
    this.topicInput?.nativeElement?.focus();
  }

  onFocus() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    this.showSuggestions.set(true);
  }

  onBlur() {
    this.blurTimeout = setTimeout(() => {
      this.showSuggestions.set(false);
      this.addInputTextAsTopic();
    }, 150);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addInputTextAsTopic();
    } else if (event.key === 'Backspace' && this.inputText() === '') {
      // Remover el último chip si el input está vacío
      const current = this.selectedTopics();
      if (current.length > 0) {
        this.removeTopic(current[current.length - 1]);
      }
    }
  }

  async selectSuggestion(sugg: string) {
    this.addTopic(sugg);
    this.inputText.set('');
    this.focusInput();
  }

  async addInputTextAsTopic() {
    const text = this.inputText().trim();
    if (!text) return;
    
    // Capitalizar la primera letra por convención
    const formatted = text.charAt(0).toUpperCase() + text.slice(1);
    await this.addTopic(formatted);
    this.inputText.set('');
  }

  async addTopic(topic: string) {
    const current = this.selectedTopics();
    if (current.includes(topic)) return;
    
    const newTopics = [...current, topic];
    this.selectedTopics.set(newTopics);
    this.notifyChange();

    // Guardarlo en el backend si no existe
    const areaId = this._session.activeAdscription()?.id_area;
    if (areaId && !this.availableSuggestions().includes(topic)) {
      try {
        const updated = await this._areaService.addTema(areaId, topic);
        this.availableSuggestions.set(updated);
      } catch (e) {
        console.error('Error saving new topic', e);
      }
    }
  }

  removeTopic(topic: string) {
    const filtered = this.selectedTopics().filter(t => t !== topic);
    this.selectedTopics.set(filtered);
    this.notifyChange();
  }
}
