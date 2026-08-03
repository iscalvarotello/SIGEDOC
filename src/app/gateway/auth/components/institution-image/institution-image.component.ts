import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartImageComponent } from '@system-shared/images/smart-image/smart-image.component';

@Component({
  selector: 'app-institution-image',
  standalone: true,
  imports: [CommonModule, SmartImageComponent],
  template: `
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="flex justify-center min-h-16">
        @if (shield()) {
          <smart-image 
            [src]="shield()" 
            [marco]="true"
            [width]="width()" [height]="height()"
            imgClass="object-contain dark:brightness-110" 
            alt="Escudo Institucional">
          </smart-image>
        } @else {
          <smart-image name="escudo" [marco]="true" [width]="width()" [height]="height()" imgClass="object-contain dark:brightness-110"></smart-image>
        }
      </div>
      @if (name()) {
        <h2 class="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase text-center min-h-4">
          {{ name() }}
        </h2>
      }
    </div>
  `
})
export class InstitutionImageComponent {
  shield = input<string | undefined>(undefined);
  name = input<string | undefined>('');
  width = input<number | string>(480);
  height = input<number | string>(170);
}
