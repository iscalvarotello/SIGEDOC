import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { DocumentInboxDTO } from '../interfaces/document-inbox.dto';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseApiService<DocumentInboxDTO> {

  // Bandejas de correspondencia recibida (Inbound)
  public readonly bandejasRecibidas = {
    porRecibir: '📥 Por recibir',
    recibidos: '📨 Recibidos',
    porAtender: '🎯 Para atención',
    atendidas: '✅ Atendidos',
    rechazados: '❌ Rechazados'
  };

  // Bandejas de correspondencia enviada (Outbound)
  public readonly bandejasEnviadas = {
    enEdicion: '✏️ En edición',
    enCorreccion: '⚠️ En correccion',
    enCorreccionRevisor: '✏️ En correccion', // Usada en el enrutamiento de revisores
    paraRevision: '📋 Para revisión',
    enRevision: '🔍 En revision',
    revisado: '✔️ Revisado',
    autorizados: '✍️ Autorizados',
    paraDespachar: '📦 Para despachar',
    despachados: '📤 Despachados',
    entregados: '✅ Entregados',
    cancelados: '❌ Cancelados'
  };

  // Bandejas de correspondencia externa (Oficialía de Partes -> Institución)
  public readonly bandejasExternas = {
    recibidos: '📥 Externa - Recibidos',
    turnados: '🎯 Externa - Turnados',
    atendidos: '✅ Externa - Atendidos'
  };

  // ── Historial / Trazabilidad ──────────────────────────────────────────
  public async getLogs(id: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(this.http.get<any[]>(this.apiRouteService.getAbsoluteUrl(`documents/documentos/${id}/logs`)));
      return response;
    } catch (error) {
      console.error('Error in getLogs:', error);
      throw error;
    }
  }

  // 📄 Renderizado en Google Docs ──────────────────────────────────
  public async renderGoogleDoc(id: string, recreate: boolean = false): Promise<{ driveId: string, driveUrl: string }> {
    try {
      const url = recreate ? `documents/documentos/${id}/render-google-docs?recreate=true` : `documents/documentos/${id}/render-google-docs`;
      const response = await firstValueFrom(this.http.post<{ driveId: string, driveUrl: string }>(
        this.apiRouteService.getAbsoluteUrl(url), 
        {}
      ));
      return response;
    } catch (error) {
      console.error('Error in renderGoogleDoc:', error);
      throw error;
    }
  }

  // Listas agrupadas para filtrado masivo
  public readonly listRecibidas = [
    this.bandejasRecibidas.porRecibir,
    this.bandejasRecibidas.recibidos,
    this.bandejasRecibidas.porAtender,
    this.bandejasRecibidas.atendidas,
    this.bandejasRecibidas.rechazados
  ];

  public readonly listEnviadas = [
    this.bandejasEnviadas.enEdicion,
    this.bandejasEnviadas.enCorreccion,
    this.bandejasEnviadas.enCorreccionRevisor,
    this.bandejasEnviadas.paraRevision,
    this.bandejasEnviadas.enRevision,
    this.bandejasEnviadas.revisado,
    this.bandejasEnviadas.autorizados,
    this.bandejasEnviadas.paraDespachar,
    this.bandejasEnviadas.despachados,
    this.bandejasEnviadas.entregados,
    this.bandejasEnviadas.cancelados
  ];

  public readonly listExternas = [
    this.bandejasExternas.recibidos,
    this.bandejasExternas.turnados,
    this.bandejasExternas.atendidos
  ];

  constructor() {
    super(ENDPOINT_KEYS.DOCUMENTS, DocumentInboxDTO);
  }

  /**
   * Obtiene la bandeja de entrada (Inbox) agrupada para el área adscrita activa.
   * @param areaId ID del área actual.
   * @param sinceDate Opcional. Carga documentos actualizados desde esta fecha (YYYY-MM-DD).
   */
  public async getInbox(areaId: string, sinceDate?: string, year?: number): Promise<any> {
    const queryParams: Record<string, any> = { area_id: areaId };
    if (sinceDate) {
      queryParams['since_date'] = sinceDate;
    }
    if (year !== undefined) {
      queryParams['year'] = year;
    }
    // No usamos plain=true para recibir la estructura completa { bandejas: [], data: [], owner: {} }
    return this.executeSpecialRoute('inbox', undefined, undefined, queryParams);
  }

  /**
   * Ejecuta una acción de estado del documento.
   * @param id ID del documento.
   * @param payload DTO con la acción y comentarios/revisores.
   */

  public async syncTextFromDrive(id: string): Promise<{ text: string }> {
    return this.executeSpecialRoute<{ text: string }>('syncTextFromDrive', { id });
  }
  public async processAction(id: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('action', { id }, payload);
  }

  /**
   * Consolida el documento y sus anexos de manera definitiva.
   * @param id ID del documento.
   */
  public async consolidateDocument(id: string): Promise<any> {
    return this.executeSpecialRoute('consolidate', { id }, {});
  }

  /**
   * Rechaza un documento (Acción directa para atajo POST /rechazar).
   * @param id ID del documento.
   * @param payload DTO con los comentarios opcionales.
   */
  public async rejectAction(id: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('rechazar', { id }, payload);
  }

  /**
   * Genera una contestación cruzada (Reply).
   * @param id ID del documento padre.
   * @param payload Datos complementarios (clase, tipo, solicitante, remitente, template).
   */
  public async reply(id: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('reply', { id }, payload);
  }

  /**
   * Genera un seguimiento de oficio del mismo bando (Follow-up).
   * @param id ID del documento padre.
   * @param payload Datos complementarios (clase, tipo, solicitante, remitente, template).
   */
  public async followUp(id: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('followUp', { id }, payload);
  }

  /**
   * Descarga el HTML de emergencia del documento.
   */
  public async downloadEmergencyHtml(id: string): Promise<Blob> {
    const res = await this.executeSpecialRoute<any>('renderEmergencyHtml', { id });
    return res && res.data ? res.data : res;
  }

  /**
   * Descarga el PDF Final del documento.
   * Retorna un Blob con el archivo PDF.
   */
  public async downloadPdf(id: string): Promise<Blob> {
    const res = await this.executeSpecialRoute<any>('download', { id });
    return res && res.data ? res.data : res;
  }

  /**
   * Obtiene el PDF Borrador del documento (con membrete pero sin sello oficial).
   * Retorna un Blob con el archivo PDF.
   */
  public async testPdf(id: string, withAcuse: boolean = false): Promise<any> {
    const res = await this.executeSpecialRoute<any>('testPdf', { id }, undefined, { with_acuse : withAcuse });
    return res && res.data ? res.data : res;
  }

  /**
   * Regenera el PDF Oficial del documento.
   */
  public async regeneratePdf(id: string): Promise<any> {
    return this.executeSpecialRoute('regeneratePdf', { id });
  }

  /**
   * Agrega un C.C.P. al documento seleccionado en caliente.
   * @param id ID del documento.
   * @param payload Objeto { id_area: string, id_empleado: string, motivo: string }
   */
  public async addCcp(id: string, payload: any): Promise<any> {
    return this.executeSpecialRoute('addCcp', { id }, payload);
  }

  /**
   * Obtiene la lista de revisores posibles para un documento.
   * @param id ID del documento.
   */
  public async getPossibleReviewers(id: string): Promise<any[]> {
    const res = await this.executeSpecialRoute<any>('possibleReviewers', { id }, undefined, { _t: new Date().getTime() });
    return res && res.data !== undefined ? res.data : res;
  }

  /**
   * Actualiza o elimina los comentarios/observaciones del documento.
   * @param id ID del documento.
   * @param comentarios Nuevos comentarios o null para limpiar.
   */
  public async updateComments(id: string, comentarios: string | null): Promise<any> {
    return this.executeSpecialRoute('comments', { id }, { comentarios });
  }

  public async updateDetails(id: string, details: { asunto?: string, temas?: string }): Promise<any> {
    return this.executeSpecialRoute('details', { id }, details);
  }

  /**
   * Obtiene la estructura pre-llenada para seguimiento o respuesta de un documento.
   * @param id ID del documento original.
   * @param action 'seguimiento' o 'respuesta'.
   */
  public async getDraftAction(id: string, action: 'seguimiento' | 'respuesta'): Promise<any> {
    return this.executeSpecialRoute('draftAction', { id }, undefined, { action });
  }

  /**
   * Sube el acuse físico de un documento.
   * @param id ID del documento.
   * @param file Archivo PDF del acuse.
   * @param idRecibe ID opcional del empleado que recibe en físico.
   */
  public async uploadPhysicalAcuse(id: string, file: File, idRecibe?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (idRecibe) {
      formData.append('id_recibe', idRecibe);
    }
    return this.executeSpecialRoute('uploadAcuse', { id }, formData);
  }

  /**
   * Actualiza los anexos vinculados al documento.
   * @param id ID del documento.
   * @param attachments Lista de anexos.
   */
  
  public async uploadWordDraft(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.executeSpecialRoute('uploadWordDraft', { id }, formData);
  }

  public async downloadWordDraft(id: string): Promise<void> {
    const url = `${this.apiRouter.getByIdUrl(id)}/word-draft`;
    try {
      const response = await this.http.get(url, { responseType: 'blob', observe: 'response' }).toPromise();
      if (response && response.body) {
        const blob = response.body;
        if (blob.type === 'application/json') {
          const text = await blob.text();
          const json = JSON.parse(text);
          throw new Error(json.message || 'Error al generar el documento');
        }
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        let filename = `Documento_${id}.docx`;
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
            const matches = /filename="([^"]+)"/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = matches[1];
            } else {
                const matches2 = /filename=([^;]+)/.exec(contentDisposition);
                if (matches2 && matches2[1]) filename = matches2[1];
            }
            try { filename = decodeURIComponent(filename); } catch(e) {}
        }
        
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error downloading Word draft', error);
      throw error;
    }
  }

  public async updateAttachments(id: string, attachments: any[]): Promise<any> {
    return this.executeSpecialRoute('updateAttachments', { id }, { attachments });
  }

  /**
   * Obtiene los anexos vinculados a un documento.
   * @param id ID del documento.
   */
  public async getAttachments(id: string): Promise<any[]> {
    const res = await this.executeSpecialRoute<any>('getAttachments', { id });
    return res && res.data !== undefined ? res.data : res;
  }

  // Cache para PDFs individuales y fusionados para evitar descargas duplicadas
  private _pdfCache = new Map<string, { blob: Blob; url: string }>();
  private _mergedPdfCache = new Map<string, { blob: Blob; url: string }>();

  public getCachedPdf(id: string): string | null {
    return this._pdfCache.get(id)?.url || null;
  }

  public setCachedPdf(id: string, blob: Blob, url: string) {
    this._pdfCache.set(id, { blob, url });
  }

  public clearCachedPdf(id: string) {
    const cached = this._pdfCache.get(id);
    if (cached) {
      URL.revokeObjectURL(cached.url);
      this._pdfCache.delete(id);
    }
  }

  public getCachedMergedPdf(id: string): string | null {
    return this._mergedPdfCache.get(id)?.url || null;
  }

  public setCachedMergedPdf(id: string, blob: Blob, url: string) {
    this._mergedPdfCache.set(id, { blob, url });
  }

  public clearPdfCache() {
    this._pdfCache.forEach(item => URL.revokeObjectURL(item.url));
    this._pdfCache.clear();
    this._mergedPdfCache.forEach(item => URL.revokeObjectURL(item.url));
    this._mergedPdfCache.clear();
  }

  public isUrlCached(url: string): boolean {
    const inPdfCache = Array.from(this._pdfCache.values()).some(item => item.url === url);
    const inMergedCache = Array.from(this._mergedPdfCache.values()).some(item => item.url === url);
    return inPdfCache || inMergedCache;
  }

  /**
   * Descarga el PDF Fusionado (documento principal + anexos).
   * Retorna un Blob con el archivo PDF.
   */
  public async downloadMergedPdf(id: string): Promise<Blob> {
    const res = await this.executeSpecialRoute<any>('downloadMerged', { id });
    return res && res.data ? res.data : res;
  }
}


