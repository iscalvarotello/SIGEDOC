import { DocumentPermissionsService } from '../../services/document-permissions.service';
import { Component, input, output, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { GoogleDriveViewerLinkComponent } from '@system-shared/media/google-drive-viewer-link/google-drive-viewer-link.component';
import { OpenPdfButtonComponent } from '@system-shared/buttons/open-pdf-button/open-pdf-button.component';
import { PreviewPdfButtonComponent } from '@system-shared/buttons/preview-pdf-button/preview-pdf-button.component';
import { BadgeComponent } from '@system-shared/ui/badge/badge.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-doc-card',
  standalone: true,
  imports: [CommonModule, GoogleDriveViewerLinkComponent, OpenPdfButtonComponent, PreviewPdfButtonComponent, BadgeComponent, IconComponent],
  templateUrl: './doc-card.component.html',
})
export class DocCardComponent {
  perms = inject(DocumentPermissionsService);
  doc = input.required<any>();
  selectedDocId = input<string | null>(null);
  bulkSelectionEnabled = input<boolean>(false);
  isSelectedForBulk = input<boolean>(false);

  selectDocument = output<string>();
  openPdf = output<{ type: 'draft' | 'final'; doc: any }>();
  toggleBulk = output<string>();
}

