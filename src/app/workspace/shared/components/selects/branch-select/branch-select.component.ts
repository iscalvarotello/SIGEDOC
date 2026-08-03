import { Component, OnInit, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../../../../workspace/database/organization/branches/branch.service';
import { BranchDTO } from '../../../../../workspace/database/organization/branches/branch.dto';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';

@Component({
  selector: 'app-branch-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ListboxComponent],
  template: `
    <app-listbox
      [options]="branchOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="loadBranches(true)"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class BranchSelectComponent implements OnInit {
  selectedId = input<string>('');
  placeholder = input<string>('Seleccione Sucursal...');
  disabled = input<boolean>(false);
  showReload = input<boolean>(true);

  onSelect = output<BranchDTO>();

  private branchService = inject(BranchService);
  rawBranches = signal<BranchDTO[]>([]);
  isLoading = signal<boolean>(false);

  branchOptions = computed(() => {
    return this.rawBranches().map(item => {
      const label = item.name + (item.city ? ` (${item.city})` : '');
      return {
        value: item.id,
        label: label,
        raw: item,
        iconKey: 'MapPin'
      };
    });
  });

  ngOnInit() {
    this.loadBranches();
  }

  async loadBranches(forceRefresh = false) {
    this.isLoading.set(true);
    try {
      const response = await this.branchService.getAll(
        undefined, 
        { enabled: true, key: 'BRANCHES_COMBO', ttlMinutes: 10 }, 
        forceRefresh
      );
      this.rawBranches.set(response.data || []);
    } catch (error) {
      console.error('Error al cargar catálogo de sucursales en BranchSelect:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleSelectionChange(opt: any) {
    if (opt) {
      this.onSelect.emit(opt.raw);
    }
  }
}
