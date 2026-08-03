import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ViewerSelectorComponent, ViewerOption } from '../viewer-selector/viewer-selector.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ViewerSelectorComponent, ActionButtonComponent],
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
  showRegenerateButton = input<boolean>(false);
  isRegenerating = input<boolean>(false);

  // Model (two-way binding for option selection)
  selectedOption = model<ViewerOption | null>(null);

  // Outputs
  newTabClick = output<void>();
  closeClick = output<void>();
  regenerateClick = output<void>();

  openPdfInNewTab() {
    this.newTabClick.emit();
  }

  closePdfViewer() {
    this.closeClick.emit();
  }
}
