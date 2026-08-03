import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartImageComponent, ImageShape } from '../smart-image/smart-image.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'profile-photo',
  standalone: true,
  imports: [CommonModule, SmartImageComponent, IconComponent],
  template: `
    @if (!hasError() && src()) {
      <smart-image 
        [src]="src() ?? undefined" 
        [alt]="alt()" 
        [shape]="shape()"
        [imgClass]="imgClass()"
        [width]="width()"
        [height]="height()"
        (error)="onError()">
      </smart-image>
    } @else {
      <icon [icon]="fallbackIcon()" class="w-1/2 h-1/2 text-gray-400"></icon>
    }
  `,
  host: {
    'class': 'inline-flex items-center justify-center shrink-0 overflow-hidden'
  }
})
export class ProfilePhotoComponent {
  src = input.required<string | null>();
  alt = input<string>('User profile photo');
  shape = input<ImageShape>('circle'); // Por defecto siempre redonda
  width = input<number | string>('100%');
  height = input<number | string>('100%');
  imgClass = input<string>('h-full w-full object-cover');
  fallbackIcon = input<string>('AvatarPremium');

  photoError = output<void>();
  hasError = signal<boolean>(false);

  onError() {
    this.hasError.set(true);
    this.photoError.emit();
  }
}
