import { Injectable, inject } from '@angular/core';
import { SesionService } from '@services/sesion.service';

@Injectable({ providedIn: 'root' })
export class DocumentPermissionsService {
  private _session = inject(SesionService);

  isRemitente(doc: any): boolean {
    const currentEmployeeId = this._session.currentUserData()?.id_empleado;
    const docRemitenteId = doc?.id_remitente;
    if (!currentEmployeeId || !docRemitenteId) return false;
    return String(currentEmployeeId) === String(docRemitenteId);
  }

  isAutor(doc: any): boolean {
    const currentEmployeeId = this._session.currentUserData()?.id_empleado;
    const docAuthorId = doc?.id_usuario_creacion; // Or whatever represents autor
    if (!currentEmployeeId || !docAuthorId) return false;
    return String(currentEmployeeId) === String(docAuthorId);
  }

  canSignDigitally(doc: any): boolean {
    if (!doc) return false;
    // Debes ser el remitente, y el documento debe estar en un estado donde se permita firmar (Autorizados o Para despachar)
    const isAuthorizedState = doc.bandeja === '🚀 Autorizados' || doc.bandeja === '📤 Para despachar' || doc.estatus_emisor === 'autorizado' || doc.estatus_emisor === 'para_despachar';
    return isAuthorizedState && this.isRemitente(doc);
  }

  canSignAutograph(doc: any): boolean {
    if (!doc) return false;
    // Cualquier persona con acceso al documento en bandeja de autorizados puede firmar autógrafamente (imprimir y firmar físico)
    const isAuthorizedState = doc.bandeja === '🚀 Autorizados' || doc.bandeja === '📤 Para despachar' || doc.estatus_emisor === 'autorizado' || doc.estatus_emisor === 'para_despachar';
    return isAuthorizedState;
  }
}
