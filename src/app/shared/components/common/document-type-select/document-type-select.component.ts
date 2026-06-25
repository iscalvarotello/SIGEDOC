import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENTO_MAP } from '../../../../documents/pipes/document-maps';

@Component({
  selector: 'app-document-type-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full" (click)="$event.stopPropagation()">
      <!-- Select Button -->
      <button 
        type="button" 
        [disabled]="disabled()"
        (click)="toggleOpen()"
        class="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#BC955C] focus:ring-1 focus:ring-[#BC955C] rounded-xl text-sm transition-all outline-none text-gray-700 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
        
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#691C32] dark:bg-gray-800 dark:border-gray-700 dark:text-[#BC955C] shadow-sm">
            @switch (value()) {
              @case ('memo') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              }
              @case ('oficio') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              }
              @case ('ti') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              }
              @case ('circular') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
              }
              @default {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              }
            }
          </div>
          <span class="tracking-wide">{{ getSelectedLabel() }}</span>
        </div>

        <div class="flex items-center justify-center bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-8 h-8 rounded-lg shadow-sm">
          <svg class="w-4 h-4 text-gray-500 transition-transform duration-300" [class.rotate-180]="isOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-fadeIn py-1.5 ring-1 ring-black/5">
          @for (doc of documentTypes; track doc.id) {
            <button 
              type="button"
              (click)="selectOption(doc.id)"
              [class.bg-gray-50]="value() === doc.id"
              [class.dark:bg-gray-700]="value() === doc.id"
              class="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-l-4"
              [class.border-[#691C32]]="value() === doc.id"
              [class.border-transparent]="value() !== doc.id">
              
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg border shadow-sm transition-all"
                     [class.bg-white]="value() === doc.id"
                     [class.border-[#691C32]/30]="value() === doc.id"
                     [class.text-[#691C32]]="value() === doc.id"
                     [class.bg-gray-100]="value() !== doc.id"
                     [class.border-transparent]="value() !== doc.id"
                     [class.text-gray-500]="value() !== doc.id"
                     [class.dark:bg-gray-800]="value() === doc.id"
                     [class.dark:border-[#BC955C]/30]="value() === doc.id"
                     [class.dark:text-[#BC955C]]="value() === doc.id"
                     [class.dark:bg-gray-800]="value() !== doc.id"
                     [class.dark:text-gray-400]="value() !== doc.id">
                  
                  @switch (doc.id) {
                    @case ('memo') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    }
                    @case ('oficio') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    }
                    @case ('ti') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    }
                    @case ('circular') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                    }
                    @default {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    }
                  }
                </div>
                
                <span class="tracking-wide">{{ doc.label }}</span>
              </div>

              @if (value() === doc.id) {
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-[#691C32]/10 text-[#691C32] dark:bg-[#BC955C]/20 dark:text-[#BC955C] mr-2">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              }
            </button>
          }
        </div>
      }
    </div>
  `
})
export class DocumentTypeSelectComponent {
  value = input<string>('memo');
  disabled = input<boolean>(false);
  valueChange = output<string>();

  isOpen = signal<boolean>(false);
  documentTypes = Object.values(DOCUMENTO_MAP);
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleOpen() {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  selectOption(id: string) {
    this.valueChange.emit(id);
    this.isOpen.set(false);
  }

  getSelectedLabel(): string {
    const doc = DOCUMENTO_MAP[this.value() as keyof typeof DOCUMENTO_MAP];
    return doc ? doc.label : 'Seleccionar Tipo...';
  }
}
