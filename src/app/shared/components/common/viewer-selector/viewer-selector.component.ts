import { Component, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ViewerOption {
  id: string;
  label: string;
  sublabel?: string;
  type: 'document' | 'attachment' | 'merged';
}

@Component({
  selector: 'app-viewer-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer-selector.component.html'
})
export class ViewerSelectorComponent {
  private _elementRef = inject(ElementRef);

  options = input<ViewerOption[]>([]);
  selectedOption = model<ViewerOption | null>(null);

  isOpen = signal<boolean>(false);

  toggleDropdown() {
    this.isOpen.update(val => !val);
  }

  selectOption(option: ViewerOption) {
    this.selectedOption.set(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
