import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleDriveViewerLinkComponent } from '@shared/components/common/google-drive-viewer-link/google-drive-viewer-link.component';
import { OpenPdfButtonComponent } from '@shared/components/common/open-pdf-button/open-pdf-button.component';
import { PreviewPdfButtonComponent } from '@shared/components/common/preview-pdf-button/preview-pdf-button.component';

@Component({
  selector: 'app-doc-card',
  standalone: true,
  imports: [CommonModule, GoogleDriveViewerLinkComponent, OpenPdfButtonComponent, PreviewPdfButtonComponent],
  templateUrl: './doc-card.component.html',
})
export class DocCardComponent {
  doc = input.required<any>();
  selectedDocId = input<string | null>(null);

  selectDocument = output<string>();
  openPdf = output<{ type: 'draft' | 'final'; doc: any }>();
}