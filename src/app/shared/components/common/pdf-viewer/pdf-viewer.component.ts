import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ViewerSelectorComponent, ViewerOption } from '../viewer-selector/viewer-selector.component';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ViewerSelectorComponent],
  templateUrl: './pdf-viewer.component.html'
})
export class PdfViewerComponent {
  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  pdfUrl = input<SafeResourceUrl | null>(null);
  isLoading = input<boolean>(false);
  options = input<ViewerOption[]>([]);
  showNewTabButton = input<boolean>(true);
  showCloseButton = input<boolean>(true);

  // Model (two-way binding for option selection)
  selectedOption = model<ViewerOption | null>(null);

  // Outputs
  newTabClick = output<void>();
  closeClick = output<void>();

  openPdfInNewTab() {
    this.newTabClick.emit();
  }

  closePdfViewer() {
    this.closeClick.emit();
  }
}
