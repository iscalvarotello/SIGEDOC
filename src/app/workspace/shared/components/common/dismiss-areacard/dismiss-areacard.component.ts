import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-dismiss-areacard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 dark:text-gray-600 animate-pulse">
        @if (iconType() === 'folder') {
          <icon icon="FolderPlus" class="w-12 h-12"></icon>
        } @else {
          <icon icon="Users" class="w-12 h-12"></icon>
        }
      </div>
      <div class="max-w-md flex flex-col gap-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ title() }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ description() }}
        </p>
      </div>
    </div>
  `
})
export class DismissAreacardComponent {
  title = input<string>('Ningún área seleccionada');
  description = input<string>('Por favor, elija una de las áreas en el organigrama lateral izquierdo para visualizar.');
  iconType = input<'users' | 'folder'>('users');
}
