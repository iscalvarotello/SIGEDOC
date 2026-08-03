import { Component, input, output, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { ProjectService } from '@organization/projects/project.service';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-select',
  standalone: true,
  imports: [CommonModule, ListboxComponent, FormsModule],
  template: `
    <app-listbox
      [options]="projectsOptions()"
      [placeholder]="placeholder()"
      [disabledInput]="disabled()"
      [showReload]="showReload()"
      [isLoading]="isLoading()"
      [searchable]="true"
      (onReload)="onReloadClick()"
      (onSelectionChange)="handleSelectionChange($event)"
      [ngModel]="selectedId()">
      <ng-template #optionTemplate let-opt>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="font-bold text-sm text-gray-800 dark:text-gray-200 block truncate" [title]="opt.raw.name">
            {{ opt.raw.name }}
          </span>
          <span class="text-[10px] text-gray-450 flex flex-nowrap items-center gap-1.5 min-w-0">
            <span class="font-semibold text-gray-500 dark:text-gray-400 shrink-0">Clave: {{ opt.raw.code || 'S/C' }}</span>
            @if (opt.raw.oficial_name) {
              <span class="shrink-0">•</span>
              <span class="text-theme-secondary font-semibold truncate block" [title]="opt.raw.oficial_name">
                {{ opt.raw.oficial_name }}
              </span>
            }
          </span>
        </div>
      </ng-template>
    </app-listbox>
  `,
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class ProjectSelectComponent implements OnInit {
  icons = SVG_ICONS;
  selectedId = input<string>('');
  
  // Soporte híbrido: si se pasa una lista externa la usamos, de lo contrario cargamos internamente.
  projectsListInput = input<any[] | null>(null, { alias: 'projectsList' });
  private _internalList = signal<any[]>([]);
  projectsList = computed(() => this.projectsListInput() !== null ? this.projectsListInput()! : this._internalList());

  placeholder = input<string>('Buscar proyecto por nombre o clave...');
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

  private projectService = inject(ProjectService);

  constructor() {
    // Sincronizar el objeto seleccionado inicialmente y cuando cambia el selectedId
    effect(() => {
      const id = this.selectedId();
      const list = this.projectsList();
      if (id && list.length > 0) {
        const proj = list.find(p => p.id === id);
        if (proj) {
          setTimeout(() => {
            this.onSelect.emit(proj);
          });
        }
      }
    });
  }

  ngOnInit() {
    if (this.projectsListInput() === null) {
      this.loadProjects();
    }
  }

  async loadProjects(forceRefresh = false) {
    this._internalLoading.set(true);
    try {
      const res = await this.projectService.getAll({ active: true }, undefined, forceRefresh);
      this._internalList.set(res.data || []);
    } catch (err) {
      console.error('Error al cargar proyectos en ProjectSelectComponent:', err);
    } finally {
      this._internalLoading.set(false);
    }
  }

  onReloadClick() {
    if (this.projectsListInput() === null) {
      this.loadProjects(true);
    }
    this.onReload.emit();
  }

  projectsOptions = computed(() => {
    return this.projectsList().map(proj => ({
      value: proj.id,
      label: `${proj.name} [${proj.code}] ${proj.oficial_name ? ' - ' + proj.oficial_name : ''}`,
      raw: proj,
      iconKey: 'Maletin'
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
