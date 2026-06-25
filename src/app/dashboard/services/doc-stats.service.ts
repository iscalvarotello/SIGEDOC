import { Injectable, inject } from '@angular/core';
import { DocumentService } from '../../documents/services/document.service';

@Injectable({
  providedIn: 'root'
})
export class DocStatsService {
  private documentService = inject(DocumentService);

  /**
   * Calcula las estadísticas de correspondencia (recibida y enviada)
   * agrupadas por clase de documento a partir de una lista cruda de documentos.
   */
  public calculateStats(raw: any[]) {
    // Recibida (Inbound)
    const receivedDocs = raw.filter(d => 
      this.documentService.listRecibidas.includes(d.bandeja)
    );

    // Enviada (Outbound)
    const sentDocs = raw.filter(d => 
      this.documentService.listEnviadas.includes(d.bandeja)
    );

    const getStatsForClass = (docsList: any[], clase: 'memo' | 'oficio' | 'ti' | 'circular') => {
      const classDocs = docsList.filter(d => d.clase_documento === clase);
      const total = classDocs.length;
      return { total, docs: classDocs };
    };

    const getInboundStats = (clase: 'memo' | 'oficio' | 'ti' | 'circular') => {
      const { total, docs } = getStatsForClass(receivedDocs, clase);
      const porRecibir = docs.filter(d => d.bandeja === this.documentService.bandejasRecibidas.porRecibir).length;
      const recibidos = docs.filter(d => d.bandeja === this.documentService.bandejasRecibidas.recibidos).length;
      const porAtender = docs.filter(d => d.bandeja === this.documentService.bandejasRecibidas.porAtender).length;
      const atendidas = docs.filter(d => d.bandeja === this.documentService.bandejasRecibidas.atendidas || d.estatus_receptor === 'atendido').length;
      return { total, porRecibir, recibidos, porAtender, atendidas };
    };

    const getOutboundStats = (clase: 'memo' | 'oficio' | 'ti' | 'circular') => {
      const { total, docs } = getStatsForClass(sentDocs, clase);
      const borrador = docs.filter(d => 
        d.bandeja === this.documentService.bandejasEnviadas.enEdicion || 
        d.bandeja === this.documentService.bandejasEnviadas.enCorreccion || 
        d.bandeja === this.documentService.bandejasEnviadas.enCorreccionRevisor
      ).length;
      const revision = docs.filter(d => 
        d.bandeja === this.documentService.bandejasEnviadas.paraRevision || 
        d.bandeja === this.documentService.bandejasEnviadas.enRevision || 
        d.bandeja === this.documentService.bandejasEnviadas.revisado
      ).length;
      const despachado = docs.filter(d => 
        d.bandeja === this.documentService.bandejasEnviadas.autorizados || 
        d.bandeja === this.documentService.bandejasEnviadas.paraDespachar || 
        d.bandeja === this.documentService.bandejasEnviadas.despachados || 
        d.bandeja === this.documentService.bandejasEnviadas.entregados
      ).length;
      return { total, borrador, revision, despachado };
    };

    return {
      recibida: {
        memo: getInboundStats('memo'),
        oficio: getInboundStats('oficio'),
        ti: getInboundStats('ti'),
        circular: getInboundStats('circular')
      },
      enviada: {
        memo: getOutboundStats('memo'),
        oficio: getOutboundStats('oficio'),
        ti: getOutboundStats('ti'),
        circular: getOutboundStats('circular')
      }
    };
  }
}
