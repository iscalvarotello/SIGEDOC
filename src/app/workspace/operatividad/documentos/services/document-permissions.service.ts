import { Injectable, inject } from '@angular/core';
import { SesionService } from '@core/services/sesion.service';

@Injectable({ providedIn: 'root' })
export class DocumentPermissionsService {
  public _session = inject(SesionService);

  // 1. ROLES RESPECTO AL DOCUMENTO
  isRemitente(doc: any): boolean {
    const currentEmployeeId = this._session.currentUserData()?.id_empleado;
    const docRemitenteId = doc?.id_remitente || doc?.remitente?.id;
    if (!currentEmployeeId || !docRemitenteId) return false;
    return String(currentEmployeeId) === String(docRemitenteId);
  }

  isCreator(doc: any): boolean {
    const currentUser = this._session.currentUserData();
    if (!currentUser) return false;
    const currentEmployeeId = currentUser.id_empleado;
    const docAuthorId = doc?.id_solicitante || doc?.solicitante?.id || doc?.id_registrado_por;
    
    // Si soy el autor exacto, siempre soy el creador.
    if (currentEmployeeId && docAuthorId && String(currentEmployeeId) === String(docAuthorId)) {
      return true;
    }

    // Si soy el remitente exacto (el que firma), también actúo como creador
    const docRemitenteId = doc?.id_remitente || doc?.remitente?.id;
    if (currentEmployeeId && docRemitenteId && String(currentEmployeeId) === String(docRemitenteId)) {
      return true;
    }

    // Si el documento NO está restringido, revisamos si el empleado pertenece al área emisora
    if (doc && !doc.is_restricted) {
      const docAreaEmisoraId = doc.id_area_emisora || doc.area_emisora?.id;
      const userAreas = currentUser.adscriptions?.map((a: any) => String(a.area?.id)) || [];
      if (docAreaEmisoraId && userAreas.includes(String(docAreaEmisoraId))) {
        return true;
      }
    }
    
    return false;
  }

  isReviewer(doc: any): boolean {
    const currentUser = this._session.currentUserData();
    if (!currentUser) return false;
    
    const currentEmployeeId = currentUser.id_empleado;
    const docReviewerId = doc?.id_revisor || doc?.revisor?.id;
    const docAreaRemitenteId = doc?.id_area_remitente || doc?.area_remitente?.id;
    
    const isSpecificReviewer = !!docReviewerId && String(currentEmployeeId) === String(docReviewerId);
    
    let isAreaReviewer = false;
    if (!doc?.is_restricted) {
      isAreaReviewer = currentUser.adscriptions?.some((a: any) => 
        String(a.area?.id) === String(docAreaRemitenteId) && a.is_reviewer
      ) || false;
    }
    
    return isSpecificReviewer || isAreaReviewer;
  }

  isAddressee(doc: any): boolean {
    const currentEmployeeId = this._session.currentUserData()?.id_empleado;
    const areas = this._session.currentUserData()?.adscriptions?.map((a: any) => a.area?.id) || [];
    
    // Si somos receptores (a nivel rea)
    const isReceptora = doc?.id_area_receptora && areas.includes(doc.id_area_receptora);
    // Si estamos en atencin directa (turno)
    const isAtencion = doc?.id_area_atencion && areas.includes(doc.id_area_atencion);
    return Boolean(isReceptora || isAtencion);
  }

  // 2. FASES GLOBALES
  isDraftPhase(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'en_edicion' || doc.estatus_emisor === 'en_correccion';
  }

  isReviewPhase(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'en_revision' || doc.estatus_emisor === 'revisado';
  }

  isAuthorizedPhase(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'autorizado' || doc.estatus_emisor === 'para_despachar';
  }

  isFinalPhase(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'despachado' || doc.estatus_emisor === 'entregado' || doc.estatus_emisor === 'cancelado';
  }

  // 3. CAPACIDADES DE VISUALIZACIN
  canEditDetails(doc: any): boolean {
    return this.isCreator(doc) || this.isReviewer(doc);
  }

  canViewDrive(doc: any): boolean {
    if (!doc || !doc.url_drive_edition) return false;
    return (this.isDraftPhase(doc) && this.isCreator(doc)) || 
           (doc.estatus_emisor === 'en_revision' && this.isReviewer(doc)) ||
           (this.isReviewPhase(doc) && this.isCreator(doc)); // Creador ve pero sin botones de edicin
  }

  canEditBody(doc: any): boolean {
    if (!doc) return false;
    return !doc.is_final_render && this.isDraftPhase(doc) && this.isCreator(doc);
  }

  canViewDraftHtml(doc: any): boolean {
    if (!doc) return false;
    return this.isDraftPhase(doc) || this.isReviewPhase(doc) || this.isAuthorizedPhase(doc);
  }

  // 4. CAPACIDADES EMISOR (Toolbar)
  canRequestReview(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && this.isDraftPhase(doc);
  }

  canRequestThirdPartyReview(doc: any): boolean {
    if (!doc) return false;
    // Permite en edicin, o rechazos, o para el revisor en "para revisin"
    return (this.isCreator(doc) && this.isDraftPhase(doc)) || 
           (this.isReviewer(doc) && doc.estatus_emisor === 'en_revision');
  }

  canAuthorize(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && (doc.estatus_emisor === 'en_edicion' || doc.estatus_emisor === 'revisado');
  }

  canCancel(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && !this.isFinalPhase(doc);
  }

  canAddAttachments(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && doc.estatus_emisor === 'en_edicion';
  }

  canAddCcp(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && doc.estatus_emisor === 'en_edicion';
  }

  canSelfReject(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && (doc.estatus_emisor === 'revisado' || this.isAuthorizedPhase(doc));
  }

  canSignAutograph(doc: any): boolean {
    return this.isAuthorizedPhase(doc);
  }

  canDispatchAutograph(doc: any): boolean {
    if (!doc) return false;
    return this.isAuthorizedPhase(doc) && this.isCreator(doc);
  }

  canSignDigitally(doc: any): boolean {
    if (!doc) return false;
    return this.isAuthorizedPhase(doc) && this.isRemitente(doc);
  }
  
  canMakeFollowUp(doc: any): boolean {
    if (!doc) return false;
    return this.isCreator(doc) && (doc.estatus_emisor === 'despachado' || doc.estatus_emisor === 'entregado');
  }

  canUploadAcuseEmisor(doc: any): boolean {
    if (!doc) return false;
    // Emisor en Despachados
    if (this.isCreator(doc) && doc.estatus_emisor === 'despachado') return true;
    return false;
  }
  
  canReplaceAcuseEmisor(doc: any): boolean {
    if (!doc) return false;
    // Emisor en Entregados si el acuse es local y an no ha sido turnado/atendido
    if (this.isCreator(doc) && doc.estatus_emisor === 'entregado' && doc.id_drive_acuse === 'local' && doc.estatus_receptor !== 'turnado' && doc.estatus_receptor !== 'atendido') return true;
    return false;
  }

  // 5. CAPACIDADES REVISOR
  canReview(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'en_revision' && this.isReviewer(doc);
  }

  canRejectReview(doc: any): boolean {
    if (!doc) return false;
    return doc.estatus_emisor === 'en_revision' && this.isReviewer(doc);
  }

  // 6. CAPACIDADES RECEPTOR
  canReceive(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.estatus_receptor === 'por_recibir';
  }
  
  canRejectReceive(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.estatus_receptor === 'por_recibir';
  }

  canTurn(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.is_final_render && doc.estatus_receptor === 'recibido';
  }

  canReply(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.is_final_render && doc.estatus_receptor === 'recibido';
  }

  canAtender(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.is_final_render && (doc.estatus_receptor === 'recibido' || doc.estatus_receptor === 'turnado');
  }
  
  canRejectTurnado(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && doc.estatus_receptor === 'turnado';
  }

  canConsolidateMaestro(doc: any): boolean {
    if (!doc) return false;
    return this.isAddressee(doc) && !doc.is_final_render && doc.estatus_receptor === 'recibido';
  }

  canUploadAcuseReceptor(doc: any): boolean {
    if (!doc) return false;
    // Si somos receptores y fue firmado autgrafo, podemos subir acuse
    if (this.isAddressee(doc) && doc.estatus_receptor === 'recibido' && !doc.is_final_render && doc.metodo_firma === 'autografa' && doc.id_drive_acuse !== 'local') return true;
    return false;
  }
  
  canReplaceAcuseReceptor(doc: any): boolean {
    if (!doc) return false;
    if (this.isAddressee(doc) && doc.estatus_receptor === 'recibido' && !doc.is_final_render && doc.id_drive_acuse === 'local') return true;
    return false;
  }
}




