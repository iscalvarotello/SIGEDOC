import { Component, OnInit, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

// =============================================================================
// SUB-COMPONENTE: TREE VIEW NODE (RECURSIVO INTERNO)
// =============================================================================
@Component({
  selector: 'app-tree-view-node',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col ml-4 select-none">
      <!-- Fila del Nodo -->
      <div 
        class="flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 group"
        [ngClass]="{
          'bg-theme-primary/10 text-theme-primary font-semibold border-l-4 border-l-theme-primary': isSelected(),
          'text-gray-700 dark:text-gray-300': !isSelected()
        }"
        (click)="selectNode($event)">
        
        <!-- Flecha para expandir/colapsar -->
        @if (hasChildren()) {
          <span 
            class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-transform duration-200"
            [ngClass]="{ 'rotate-90': isExpanded() }"
            (click)="toggleExpand($event)">
            <icon icon="ChevronRight" class="w-3.5 h-3.5"></icon>
          </span>
        } @else {
          <!-- Placeholder para alinear nodos sin hijos -->
          <span class="w-5.5"></span>
        }

        <!-- Icono de Carpeta / Nodo -->
        <span [ngClass]="{ 'text-theme-primary': isSelected(), 'text-gray-400 dark:text-gray-500': !isSelected() }">
          @if (hasChildren()) {
            <icon icon="Folder" class="w-4 h-4"></icon>
          } @else {
            <icon icon="DocumentList" class="w-4 h-4"></icon>
          }
        </span>

        <!-- Nombre del Nodo -->
        <span class="text-sm truncate max-w-[240px]" [title]="node()[displayField()]">
          {{ node()[displayField()] }}
          @if (badgeField() && node()[badgeField()]) {
            <span class="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-theme-primary/10 group-hover:text-theme-primary transition-all">
              {{ node()[badgeField()] }}
            </span>
          }
        </span>
      </div>

      <!-- Ramas Hijas Recurrentes -->
      @if (hasChildren() && isExpanded()) {
        <div class="border-l border-gray-200 dark:border-gray-800 ml-2.5 mt-0.5 flex flex-col gap-0.5 animate-fadeIn">
          @for (child of node().children; track child.id) {
            @if (matchesFilter(child)) {
              <app-tree-view-node 
                [node]="child" 
                [selectedId]="selectedId()" 
                [searchFilter]="searchFilter()"
                [displayField]="displayField()"
                [badgeField]="badgeField()"
                [searchFields]="searchFields()"
                (onSelect)="onSelect.emit($event)">
              </app-tree-view-node>
            }
          }
        </div>
      }
    </div>
  `
})
export class TreeViewNodeComponent implements OnInit {
  node = input.required<any>();
  selectedId = input.required<string>();
  searchFilter = input.required<string>();
  displayField = input.required<string>();
  badgeField = input.required<string>();
  searchFields = input.required<string[]>();
  onSelect = output<any>();

  isExpanded = signal<boolean>(false);

  hasChildren = computed(() => {
    const children = this.node().children;
    return children && children.length > 0;
  });

  isSelected = computed(() => {
    return this.node().id === this.selectedId();
  });

  ngOnInit() {
    if (this.searchFilter() && this.hasChildren()) {
      const matchInDescendants = this.checkDescendantsMatch(this.node(), this.searchFilter(), this.searchFields());
      if (matchInDescendants) {
        this.isExpanded.set(true);
      }
    }
  }

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded.update(val => !val);
  }

  selectNode(event: Event) {
    event.stopPropagation();
    this.onSelect.emit(this.node());
  }

  matchesFilter(child: any): boolean {
    if (!this.searchFilter()) return true;
    return this.checkDescendantsMatch(child, this.searchFilter(), this.searchFields());
  }

  private checkDescendantsMatch(n: any, term: string, fields: string[]): boolean {
    if (!term) return true;
    const cleanTerm = term.toLowerCase();
    const selfMatch = fields.some(field => {
      const val = n[field];
      return val && String(val).toLowerCase().includes(cleanTerm);
    });

    if (selfMatch) return true;
    if (n.children && n.children.length > 0) {
      return n.children.some((c: any) => this.checkDescendantsMatch(c, term, fields));
    }
    return false;
  }
}

// =============================================================================
// COMPONENTE CONTENEDOR: TREE VIEW PRINCIPAL
// =============================================================================
@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, TreeViewNodeComponent, IconComponent],
  template: `
    <div class="flex flex-col gap-4 h-full">
      <!-- Encabezado / Títulos del Árbol -->
      @if (title() || subtitle()) {
        <div class="flex flex-col gap-1">
          @if (title()) {
            <h2 class="text-md font-bold text-gray-950 dark:text-white">{{ title() }}</h2>
          }
          @if (subtitle()) {
            <p class="text-xs text-gray-500">{{ subtitle() }}</p>
          }
        </div>
      }

      <!-- Buscador de Nodos -->
      <div class="relative">
        <input 
          type="text" 
          [value]="searchTerm()"
          (input)="onSearch($event)"
          [placeholder]="searchPlaceholder()"
          class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary transition-all">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <icon icon="SearchSolid" class="w-4 h-4"></icon>
        </span>
      </div>

      <!-- Visor de Árbol Scrollable -->
      <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 mt-1 border border-gray-50 dark:border-gray-800 rounded-lg p-2 bg-gray-50/50 dark:bg-gray-900/50">
        @if (isLoading()) {
          <div class="flex flex-col gap-3 py-10 items-center justify-center text-gray-500">
            <svg class="animate-spin h-6 w-6 text-theme-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xs">Cargando datos...</span>
          </div>
        } @else if (nodes().length === 0) {
          <div class="p-8 text-center text-xs text-gray-400">
            No hay información para mostrar.
          </div>
        } @else {
          @for (rootNode of nodes(); track rootNode.id) {
            <app-tree-view-node 
              [node]="rootNode" 
              [selectedId]="selectedId()"
              [searchFilter]="searchTerm()"
              [displayField]="displayField()"
              [badgeField]="badgeField()"
              [searchFields]="searchFields()"
              (onSelect)="onNodeSelect($event)">
            </app-tree-view-node>
          }
        }
      </div>
    </div>
  `
})
export class TreeViewComponent {
  nodes = input.required<any[]>();
  selectedId = input<string>('');
  isLoading = input<boolean>(false);
  title = input<string>('');
  subtitle = input<string>('');
  searchPlaceholder = input<string>('Buscar...');
  displayField = input<string>('name');
  badgeField = input<string>('acronym');
  searchFields = input<string[]>(['name', 'acronym', 'area_type']);
  
  onSelect = output<any>();

  searchTerm = signal<string>('');

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);
  }

  onNodeSelect(node: any) {
    this.onSelect.emit(node);
  }
}
