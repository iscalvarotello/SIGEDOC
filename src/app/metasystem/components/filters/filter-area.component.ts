import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AreaSelectComponent } from '@workspace-shared/components/selects/area-select/area-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-area',
  standalone: true,
  imports: [CommonModule, FormsModule, AreaSelectComponent],
  template: `
    <div class="flex items-center gap-3 w-full max-w-md">
      <div class="flex-1 min-w-0">
        <app-area-select
          placeholder="Filtrar por Área Padre..."
          [selectedId]="selectedAreaId"
          (onSelect)="selectArea($event ? $event.id : '')"
          (onClear)="selectArea('')">
        </app-area-select>
      </div>
    </div>
  `
})
export class FilterAreaComponent {
  @Output() onAreaSelect = new EventEmitter<{ parentId: string }>();
  selectedAreaId: string = '';



  selectArea(item: string) {
    this.selectedAreaId = item;
    this.onAreaSelect.emit({ parentId: item });
  }
}
