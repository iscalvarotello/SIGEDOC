import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

export type ActionButtonVariant = 'primary' | 'primary-light' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'default' | 'ghost' | 'ghost-danger' | 'ghost-info' | 'light' | 'success-light' | 'danger-light' | 'teal' | 'emerald' | 'glass';
export type ActionButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ActionButtonType = 'button' | 'submit' | 'reset';
export type ActionButtonDisplayMode = 'button' | 'link';
export type ActionButtonIconPosition = 'left' | 'right';

export type ActionButtonPreset = 'logout' | 'close' | 'cancel' | 'accept' | 'new' | 'edit' | 'delete' | 'save' | null;

@Component({
  selector: 'action-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled() || loading()"
      [title]="title()"
      (click)="clicked.emit($event)"
      [ngClass]="combinedClasses()"
      class="flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
      
      @if (iconPosition() === 'left') {
        @if (loading()) {
          <span class="animate-spin rounded-full border-2 border-t-transparent border-current" [ngClass]="spinnerClasses()"></span>
        } @else if (computedIcon()) {
          <icon [icon]="computedIcon()!" [ngClass]="iconClasses()"></icon>
        }
      }
      
      @if (computedLabel()) {
        <span>{{ computedLabel() }}</span>
      }
      
      <ng-content></ng-content>

      @if (iconPosition() === 'right') {
        @if (loading()) {
          <span class="animate-spin rounded-full border-2 border-t-transparent border-current" [ngClass]="spinnerClasses()"></span>
        } @else if (computedIcon()) {
          <icon [icon]="computedIcon()!" [ngClass]="iconClasses()"></icon>
        }
      }
    </button>
  `,
  host: {
    '[class.inline-block]': '!fullWidth()',
    '[class.block]': 'fullWidth()',
    '[class.w-full]': 'fullWidth()'
  }
})
export class ActionButtonComponent {
  label = input<string>('');
  icon = input<string>('');
  preset = input<ActionButtonPreset>(null);
  
  // Customization inputs with defaults
  variant = input<ActionButtonVariant | null>(null);
  size = input<ActionButtonSize>('sm');
  type = input<ActionButtonType>('button');
  displayMode = input<ActionButtonDisplayMode>('button');
  iconPosition = input<ActionButtonIconPosition>('left');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  iconOnly = input<boolean>(false);
  title = input<string>('');
  
  clicked = output<MouseEvent>();

  computedLabel = computed(() => {
    if (this.label()) return this.label();
    switch (this.preset()) {
      case 'logout': return 'Cerrar sesión';
      case 'close': return 'Cerrar';
      case 'cancel': return 'Cancelar';
      case 'accept': return 'Aceptar';
      case 'save': return 'Guardar';
      case 'new': return 'Nuevo';
      case 'edit': return 'Editar';
      case 'delete': return 'Eliminar';
    }
    return '';
  });

  computedIcon = computed(() => {
    if (this.icon()) return this.icon();
    switch (this.preset()) {
      case 'logout': return 'SignOut';
      case 'close': return 'Cross';
      case 'cancel': return 'Cross';
      case 'accept': return 'Check';
      case 'save': return 'SaveDisk';
      case 'new': return 'Plus';
      case 'edit': return 'LapizSolid';
      case 'delete': return 'Basurero';
    }
    return '';
  });
  


  computedVariant = computed(() => {
    if (this.variant()) return this.variant()!;
    switch (this.preset()) {
      case 'logout': return 'light';
      case 'close': return 'outline';
      case 'cancel': return 'outline';
      case 'accept': return 'primary';
      case 'save': return 'primary';
      case 'new': return 'success';
      case 'edit': return 'primary-light';
      case 'delete': return 'danger';
    }
    return 'primary'; // Default fallback
  });

  combinedClasses = computed(() => {
    const v = this.computedVariant();
    const s = this.size();
    const mode = this.displayMode();
    const fw = this.fullWidth();
    
    let classes = '';

    // Espaciado y flex
    classes += fw ? 'w-full ' : '';
    classes += this.iconOnly() ? '' : 'gap-1.5 ';

    if (mode === 'button') {
      classes += 'active:scale-95 shadow-sm border border-transparent ';
      // Paddings y redondeos para modo botón
      switch (s) {
        case 'xs': classes += this.iconOnly() ? 'p-1 text-[10px] rounded ' : 'px-2 py-1 text-[10px] rounded '; break;
        case 'sm': classes += this.iconOnly() ? 'p-1.5 text-[10px] rounded-lg ' : 'px-3 py-1.5 text-[10px] rounded-lg '; break;
        case 'md': classes += this.iconOnly() ? 'p-2 text-xs rounded-xl ' : 'px-4 py-2 text-xs rounded-xl '; break;
        case 'lg': classes += this.iconOnly() ? 'p-2.5 text-sm rounded-xl ' : 'px-5 py-2.5 text-sm rounded-xl '; break;
      }

      // Variantes modo botón
      switch (v) {
        case 'primary': classes += 'bg-theme-primary hover:opacity-90 text-white '; break;
        case 'primary-light': classes += 'bg-theme-primary/10 hover:bg-theme-primary text-theme-primary hover:text-white dark:bg-theme-primary/25 border border-theme-primary/20 '; break;
        case 'secondary': classes += 'bg-theme-secondary hover:opacity-90 text-white '; break;
        case 'success': classes += 'bg-green-500 hover:bg-green-600 text-white '; break;
        case 'danger': classes += 'bg-red-500 hover:bg-red-600 text-white '; break;
        case 'warning': classes += 'bg-amber-500 hover:bg-amber-600 text-white '; break;
        case 'info': classes += 'bg-blue-500 hover:bg-blue-600 text-white '; break;
        case 'outline': classes += 'bg-white hover:bg-gray-100 text-theme-primary !border-gray-200 '; break;
        case 'default': classes += 'bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-800 dark:text-gray-200 '; break;
        case 'ghost': classes += 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 '; break;
        case 'ghost-danger': classes += 'bg-transparent text-gray-400 hover:text-red-600 hover:bg-red-50 '; break;
        case 'ghost-info': classes += 'bg-transparent text-blue-600 hover:text-blue-800 hover:bg-blue-50 '; break;
        case 'light': classes += 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 '; break;
        case 'success-light': classes += 'bg-green-50 text-green-700 hover:bg-green-100 !border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:!border-green-500/20 '; break;
        case 'danger-light': classes += 'bg-red-50 text-red-700 hover:bg-red-100 !border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:!border-red-500/20 '; break;
        case 'teal': classes += 'bg-teal-600 hover:bg-teal-700 text-white '; break;
        case 'emerald': classes += 'bg-emerald-600 hover:bg-emerald-700 text-white '; break;
        case 'glass': classes += 'bg-white/10 hover:bg-white/20 text-white !border-white/20 '; break;
      }
    } else {
      // Modo Link
      classes += 'cursor-pointer hover:underline ';
      switch (s) {
        case 'xs': classes += 'text-[10px] '; break;
        case 'sm': classes += 'text-xs '; break;
        case 'md': classes += 'text-sm '; break;
        case 'lg': classes += 'text-base '; break;
      }
      
      switch (v) {
        case 'primary': classes += 'text-theme-primary hover:opacity-80 '; break;
        case 'secondary': classes += 'text-theme-secondary hover:opacity-80 '; break;
        case 'success': classes += 'text-green-600 hover:text-green-800 '; break;
        case 'danger': classes += 'text-red-600 hover:text-red-800 '; break;
        case 'teal': classes += 'text-teal-600 hover:text-teal-800 '; break;
        case 'emerald': classes += 'text-emerald-600 hover:text-emerald-800 '; break;
        default: classes += 'text-gray-600 hover:text-gray-800 '; break;
      }
    }

    return classes;
  });

  iconClasses = computed(() => {
    const s = this.size();
    switch (s) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-3.5 h-3.5';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-3.5 h-3.5';
    }
  });

  spinnerClasses = computed(() => {
    const s = this.size();
    switch (s) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-3.5 h-3.5';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-3.5 h-3.5';
    }
  });
}