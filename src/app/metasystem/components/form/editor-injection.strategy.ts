import { Directive } from '@angular/core';

@Directive()
export abstract class EditorInjectionStrategy {
  /** Inyecta texto en la posición actual del cursor del editor activo */
  abstract insertTextAtCursor(text: string): void;
}
