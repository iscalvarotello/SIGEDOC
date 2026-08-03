import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SesionService } from '@services/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private sesionService = inject(SesionService);

  /**
   * Realiza el inicio de sesión contra el backend de NestJS
   */
  async login(email: string, password: string, institutionId?: string): Promise<any> {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const url = `${baseUrl}/auth/login`;
    
    try {
      const body: any = { email, password };
      if (institutionId) {
        body.institution_id = institutionId;
      }

      const response = await firstValueFrom(
        this.http.post<any>(url, body)
      );
      
      if (response && response.token && response.user) {
        if (response.reset_password_required) {
          response.user.reset_password_required = true;
        }
        await this.sesionService.setSession(response);
      }
      return response;
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw error;
    }
  }

  /**
   * Inicializa el super administrador por primera vez
   */
  async setupFirstAdmin(email: string, password: string): Promise<any> {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const url = `${baseUrl}/users/usuarios/setup-first-admin`;
    
    try {
      const body = { email, password };
      return await firstValueFrom(this.http.post<any>(url, body));
    } catch (error) {
      console.error('Error durante la inicialización del sistema:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión activa
   */
  logout() {
    this.sesionService.clearSession();
  }
}
