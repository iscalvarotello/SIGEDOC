import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SesionService } from '@services/sesion.service';
import { DocumentPermissionsService } from '../../services/document-permissions.service';
import { GovSignatureService } from '@core/services/gov-signature.service';
import { copyToClipboard } from '@core/utils/clipboard.util';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'doc-actions-toolbar',
  standalone: true,
  imports: [ActionButtonComponent, CommonModule],
  templateUrl: './doc-actions-toolbar.component.html',
})
export class DocActionsToolbarComponent {
  perms = inject(DocumentPermissionsService);
  @Input() doc: any | null = null;
  @Input() isActionLoading = false;

  @Output() showForm = new EventEmitter<string>();
  @Output() submitAction = new EventEmitter<string>();
  @Output() reply = new EventEmitter<void>();
  @Output() followUp = new EventEmitter<void>();
  @Output() makeFollowUp = new EventEmitter<void>();
  @Output() consolidate = new EventEmitter<void>();
  @Output() autoRechazar = new EventEmitter<void>();

  private _session = inject(SesionService);
  public _docPermissions = inject(DocumentPermissionsService);
  private _govSignatureService = inject(GovSignatureService);

  isLoadingLink = signal<boolean>(false);
  copiedLink = signal<boolean>(false);

  get isRemitente(): boolean { return this._docPermissions.isRemitente(this.doc); }

  copySignatureLink() {
    if (!this.doc?.id) return;
    const userId = this._session.currentUserData()?.id_empleado;
    if (!userId) return;
    
    this.isLoadingLink.set(true);
    const payload = {
      documentIds: [this.doc.id],
      userId: userId,
      title: 'Firma de Documento Único',
      summary: `Documento ${this.doc.num_doc || 'BORRADOR'} listo para su firma digital.`
    };
    this._govSignatureService.generateBulkSignatureUrl(payload).subscribe({
      next: (res: any) => {
        if (res?.url) {
          const successCallback = () => {
            this.copiedLink.set(true);
            setTimeout(() => this.copiedLink.set(false), 3000);
          };

          copyToClipboard(res.url).then(success => {
            if (success) successCallback();
          });
        }
        this.isLoadingLink.set(false);
      },
      error: (err: any) => {
        console.error('Error al obtener URL de firma:', err);
        alert(err?.error?.message || 'Ocurrió un error al generar la URL de firma.');
        this.isLoadingLink.set(false);
      }
    });
  }
}


