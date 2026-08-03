import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-dynamic-error-bubble',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (control() && control()!.invalid && (control()!.touched || control()!.hasError('serverError'))) {
      <div class="relative mt-2 animate-fade-in-up">
        <!-- Flechita apuntando hacia arriba -->
        <div class="absolute -top-1.5 left-4 w-3 h-3 rotate-45 border-l border-t"
             [ngClass]="isWarning() ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'">
        </div>
        
        <!-- Burbuja -->
        <div class="relative px-3 py-2 rounded-lg border flex items-start gap-2 shadow-sm"
             [ngClass]="isWarning() ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'">
          
          <icon [icon]="isWarning() ? 'WarningTriangle' : 'ErrorCircle'" class="w-4 h-4 mt-0.5 shrink-0"></icon>
          
          <div class="text-xs font-medium leading-relaxed">
            @if (control()!.hasError('serverError')) {
              {{ control()!.getError('serverError') }}
            } @else if (control()!.hasError('required')) {
              Este campo es obligatorio.
            } @else if (control()!.hasError('email')) {
              El formato del correo no es válido.
            } @else if (control()!.hasError('minlength')) {
              Debe tener al menos {{ control()!.getError('minlength').requiredLength }} caracteres.
            } @else if (control()!.hasError('maxlength')) {
              No puede exceder los {{ control()!.getError('maxlength').requiredLength }} caracteres.
            } @else if (control()!.hasError('pattern')) {
              El formato ingresado no es válido.
            } @else {
              El valor ingresado no es válido.
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.2s ease-out forwards;
    }
  `]
})
export class DynamicErrorBubbleComponent {
  control = input<AbstractControl | null>(null);
  
  // Por ahora todos son errores rojos. En un futuro podríamos detectar un error tipo 'warning'
  // devolviendo un booleano aquí.
  isWarning(): boolean {
    return this.control()?.hasError('warning') || false;
  }
}
