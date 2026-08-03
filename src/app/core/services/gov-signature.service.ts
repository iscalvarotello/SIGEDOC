import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SesionService } from './sesion.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface GovSignatureRequest {
  curp: string;
  id_empleado: string;
  password: string;
  documentId: string;
}

export interface GovSignatureResponse {
  success: boolean;
  message?: string;
  signedDocumentId?: string;
  qrUrl?: string;
}

export interface BulkSignatureUrlPayload {
  documentIds: string[];
  userId: string;
  title: string;
  summary: string;
}

export interface TokenValidationResponse {
  isValid: boolean;
  metadata: {
    title: string;
    summary: string;
  };
  expiresAt: string;
  hasCertificate?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GovSignatureService {
  private http = inject(HttpClient);
  private sesion = inject(SesionService);
  
  // Endpoint en nuestro backend que manejará la comunicación real con Finanzas
  private apiUrl = `${environment.URL_PATH}/signatures/gov-sign`;

  /**
   * Envía las credenciales y el servidor objetivo a nuestro backend
   * para que este realice el proceso de firmado (Opción A).
   */
  signDocument(request: GovSignatureRequest): Observable<GovSignatureResponse> {
    const formData = new FormData();
    formData.append('password', request.password);
    formData.append('userId', request.id_empleado);
    // Agregamos el documento individual como un array de 1 elemento
    formData.append('documentIds[]', request.documentId); 
    
    return this.http.post<GovSignatureResponse>(`${this.apiUrl}/execute`, formData);
  }

  /**
   * Obtiene la URL pública para firmar un lote de documentos.
   */
  generateBulkSignatureUrl(payload: BulkSignatureUrlPayload): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/url`, payload);
  }

  /**
   * Valida el token del enlace de WhatsApp y devuelve la metadata segura.
   */
  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.http.get<TokenValidationResponse>(`${this.apiUrl}/validate-token/${token}`);
  }

  /**
   * Envía el certificado en memoria (P12) y la contraseña para firmar el lote (WhatsApp).
   */
  submitCertificate(token: string, password: string, file?: File | null): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('password', password);
    formData.append('token', token);
    
    return this.http.post(`${this.apiUrl}/execute`, formData);
  }

  /**
   * Sube el certificado (.p12) del usuario al backend para su encriptación con AES-256-GCM y resguardo en BD.
   */
  registerCertificate(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    // Recuperar institution_id e inyectarlo en la solicitud
    const user = this.sesion.currentUserData();
    const activeAds = this.sesion.activeAdscription();
    const institutionId = user?.institution_id || activeAds?.institution_id || localStorage.getItem('tenant_id');
    
    if (institutionId) {
      formData.append('institutionId', institutionId);
      formData.append('institution_id', institutionId); // Enviamos ambos formatos por si acaso el DTO usa snake_case
    }
    
    return this.http.post(`${environment.URL_PATH}/signatures/certificate`, formData);
  }
}
