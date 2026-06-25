import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 bg-white transition-all cursor-pointer group text-center relative dark:bg-black/10"
      [ngClass]="isDragActive() ? 'border-[#691C32] bg-[#691C32]/5' : 'border-gray-250 hover:border-[#691C32] dark:border-gray-800 hover:bg-[#691C32]/5'"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()">
      
      <input 
        #fileInput
        type="file" 
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileSelected($event)"
        (click)="$event.stopPropagation()"
        class="hidden">
      
      <svg class="w-9 h-9 text-gray-400 group-hover:text-[#691C32] transition-colors mb-2" [ngClass]="{'text-[#691C32]': isDragActive()}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span class="text-xs font-bold text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-300" [ngClass]="{'text-gray-800': isDragActive()}">
        {{ isDragActive() ? 'Suelte el archivo aquí' : dragLabel }}
      </span>
      <span class="text-[10px] text-gray-450 font-semibold mt-0.5">{{ helpLabel }}</span>
    </div>
  `
})
export class FileUploaderComponent {
  @Input() accept = '*';
  @Input() maxSizeMB = 10;
  @Input() multiple = false;
  @Input() dragLabel = 'Arrastre aquí el archivo o haga clic para buscar';
  @Input() helpLabel = 'Tamaño máximo de archivo 10MB';

  @Output() fileSelected = new EventEmitter<File>();
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragActive = signal<boolean>(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.processFiles(Array.from(input.files));
      input.value = ''; // Reset to allow selecting the same file again
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragActive.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragActive.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragActive.set(false);
    if (event.dataTransfer && event.dataTransfer.files.length) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  private processFiles(files: File[]) {
    // Filter by type if accept is not '*'
    let filteredFiles = files;
    if (this.accept && this.accept !== '*') {
      const allowedExtensions = this.accept.split(',').map(ext => ext.trim().toLowerCase());
      filteredFiles = files.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return allowedExtensions.some(allowed => {
          if (allowed.startsWith('.')) {
            return ext === allowed;
          }
          if (allowed.endsWith('/*')) {
            const baseType = allowed.split('/')[0];
            return file.type.startsWith(baseType + '/');
          }
          return file.type === allowed;
        });
      });
      if (filteredFiles.length !== files.length) {
        alert(`Solo se aceptan archivos de tipo: ${this.accept}`);
      }
    }

    // Filter by size
    const limit = this.maxSizeMB * 1024 * 1024;
    const oversizedFiles = filteredFiles.filter(file => file.size > limit);
    if (oversizedFiles.length > 0) {
      alert(`Uno o más archivos superan el límite de ${this.maxSizeMB}MB.`);
      filteredFiles = filteredFiles.filter(file => file.size <= limit);
    }

    if (filteredFiles.length === 0) return;

    if (this.multiple) {
      this.filesSelected.emit(filteredFiles);
    } else {
      this.fileSelected.emit(filteredFiles[0]);
    }
  }
}
