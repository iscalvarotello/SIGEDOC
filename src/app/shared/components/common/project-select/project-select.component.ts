import { Component, input, output, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '../../../icons/svg-icons';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { ProjectService } from '../../../../blocks/CORE_DB/organization/projects/project.service';

@Component({
  selector: 'app-project-select',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="relative w-full flex items-center gap-1.5" [class.z-50]="isDropdownOpen()">
      
      <!-- Contenedor del Input y Dropdown -->
      <div class="flex-1 relative">
        <!-- Overlay transparente para cerrar al hacer clic afuera -->
        @if (isDropdownOpen() && !disabled()) {
          <div class="fixed inset-0 z-40" (click)="closeDropdown()"></div>
        }

        <!-- Caja de entrada y trigger -->
        <div class="relative flex items-center z-50">
          <input 
            type="text"
            [value]="isDropdownOpen() ? searchQuery() : selectedProjectLabel()"
            (input)="onSearchInput($event)"
            (focus)="openDropdown()"
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            class="w-full pl-4 pr-10 py-2 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#691C32]/30 transition-all text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="{ 'bg-white': isDropdownOpen() && !disabled() }">
          
          <!-- Iconos de la derecha -->
          <div class="absolute inset-y-0 right-3 flex items-center gap-1.5">
            @if (selectedId() && !isDropdownOpen() && !disabled()) {
              <button 
                type="button"
                (click)="clearSelection($event)"
                class="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors cursor-pointer">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            }
            <span class="text-gray-400 pointer-events-none">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
        </div>

        <!-- Panel Flotante con Resultados Filtrados -->
        @if (isDropdownOpen() && !disabled()) {
          <div class="absolute z-50 w-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-150 dark:divide-gray-800/60 animate-fadeIn animate-duration-150">
            @if (filteredProjects().length === 0) {
              <div class="p-4 text-center text-xs text-gray-450">
                No se encontraron proyectos.
              </div>
            } @else {
              @for (proj of filteredProjects(); track proj.id) {
                <button 
                  type="button"
                  (click)="selectProject(proj, $event)"
                  class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors flex flex-col gap-0.5 cursor-pointer">
                  <span class="font-bold text-xs text-gray-800 dark:text-gray-200">
                    {{ proj.name }} 
                  </span>
                  <span class="text-[9px] text-gray-450">
                    [{{ proj.code }}]
                  </span>
                  @if (proj.oficial_name) {
                    <span class="text-[9px] text-gray-450 line-clamp-1">
                      {{ proj.oficial_name }}
                    </span>
                  }
                </button>
              }
            }
          </div>
        }
      </div>

      <!-- Botón de recarga -->
      @if (showReload()) {
        <button 
          type="button" 
          (click)="onReloadClick()"
          [disabled]="isLoading() || disabled()"
          class="p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500 hover:text-[#691C32] active:scale-95 flex items-center justify-center shrink-0 disabled:opacity-50"
          title="Recargar proyectos">
          @if (isLoading()) {
            <span class="flex items-center justify-center w-3.5 h-3.5" [innerHTML]="icons.animated_reload | safeHtml"></span>
          } @else {
            <span class="w-3.5 h-3.5 flex items-center justify-center text-gray-500" [innerHTML]="icons.Refresh | safeHtml"></span>
          }
        </button>
      }

    </div>
  `
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

  selectedProjectLabel = computed(() => {
    const val = this.selectedId();
    if (!val) return '';
    const proj = this.projectsList().find(p => p.id === val);
    if (proj) {
      return `${proj.name} [${proj.code}]`;
    }
    return '';
  });

  filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.projectsList();
    
    if (!query) {
      return list;
    }
    
    return list.filter(proj => {
      const name = (proj.name || '').toLowerCase();
      const code = (proj.code || '').toLowerCase();
      const oficialName = (proj.oficial_name || '').toLowerCase();
      return name.includes(query) || code.includes(query) || oficialName.includes(query);
    });
  });

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  openDropdown() {
    if (this.disabled()) return;
    this.searchQuery.set('');
    this.isDropdownOpen.set(true);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  selectProject(proj: any, event: Event) {
    event.stopPropagation();
    this.onSelect.emit(proj);
    this.isDropdownOpen.set(false);
    this.searchQuery.set('');
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.onClear.emit();
    this.searchQuery.set('');
  }
}
