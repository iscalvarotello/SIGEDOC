import { Component, input, output, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { PartidaService } from '@organization/partidas/partida.service';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partida-select',
  standalone: true,
  imports: [CommonModule, ListboxComponent, FormsModule],
  template: `
    <app-listbox
      [options]="partidasOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class PartidaSelectComponent implements OnInit {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  
  // Soporte híbrido
  partidasListInput = input<any[] | null>(null, { alias: 'partidasList' });
  private _internalList = signal<any[]>([]);
  partidasList = computed(() => this.partidasListInput() !== null ? this.partidasListInput()! : this._internalList());

  placeholder = input<string>('Buscar partida...');
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

  private partidaService = inject(PartidaService);

  constructor() {
    // Sincronizar el objeto seleccionado inicialmente y cuando cambia el selectedId
    effect(() => {
      const id = this.selectedId();
      const list = this.partidasList();
      if (id && list.length > 0) {
        const part = list.find(p => p.id === id);
        if (part) {
          setTimeout(() => {
            this.onSelect.emit(part);
          });
        }
      }
    });
  }

  ngOnInit() {
    if (this.partidasListInput() === null) {
      this.loadPartidas();
    }
  }

  async loadPartidas(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const res = await this.partidaService.getAll({ active: true }, undefined, forceRefresh);
      this._internalList.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar partidas en PartidaSelectComponent:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    if (this.partidasListInput() === null) {
      this.loadPartidas(true);
    }
    this.onReload.emit();
  }

  partidasOptions = computed(() => {
    return this.partidasList().map(part => ({
      value: part.id,
      label: part.full_name || `${part.partida}.- ${part.descripcion}`,
      raw: part,
      iconKey: 'Ticket'
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
