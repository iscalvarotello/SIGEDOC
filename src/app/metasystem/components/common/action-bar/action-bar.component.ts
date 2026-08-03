import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_ICONS } from '@metasystem/maps/app.icon.map';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

export interface ActionBarAction {
  id: string;
  name: string;
  subtitle?: string;
  iconName: string; // Clave del diccionario SVG_ICONS
  colorClass?: string; // Clase de borde al hacer hover, ej: 'hover:border-theme-primary'
  iconColorClass?: string; // Clase de fondo/texto del circulo del icono, ej: 'bg-theme-primary/10 text-theme-primary'
  disabled?: boolean;
}

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="flex flex-col gap-2">
      @if (title()) {
        <h3 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {{ title() }}
        </h3>
      }
      <div [ngClass]="getGridClass(actions().length)" class="grid gap-3 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-150 dark:border-gray-800/80">
        
        @for (act of actions(); track act.id) {
          <button 
            [disabled]="act.disabled"
            (click)="onActionClick(act)"
            class="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center group transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            [ngClass]="act.colorClass || 'hover:border-theme-primary'">
            
            <span 
              class="p-2 rounded-full group-hover:scale-110 transition-transform flex items-center justify-center"
              [ngClass]="act.iconColorClass || 'bg-theme-primary/10 text-theme-primary'"
              [innerHTML]="getIconSvg(act.iconName) | safeHtml">
            </span>
            
            <span class="text-[11px] font-bold text-gray-850 dark:text-gray-200 mt-2 line-clamp-1">
              {{ act.name }}
            </span>
            
            @if (act.subtitle) {
              <span class="text-[9px] text-gray-400 mt-0.5 font-medium">
                {{ act.subtitle }}
              </span>
            }
          </button>
        }
        
      </div>
    </div>
  `
})
export class ActionBarComponent {
  title = input<string>('Barra de Acciones Organizacionales');
  actions = input.required<ActionBarAction[]>();

  onAction = output<ActionBarAction>();

  getGridClass(count: number): string {
    if (count <= 2) {
      return 'grid-cols-1 sm:grid-cols-2';
    }
    if (count === 3) {
      return 'grid-cols-1 sm:grid-cols-3';
    }
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
  }

  getIconSvg(name: string): string {
    return (SVG_ICONS as any)[name] || '';
  }

  onActionClick(action: ActionBarAction) {
    if (!action.disabled) {
      this.onAction.emit(action);
    }
  }
}
