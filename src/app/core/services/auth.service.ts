import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SesionService } from '../../shared/services/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private sesionService = inject(SesionService);

  /**
   * Realiza el inicio de sesión contra el backend de NestJS
   */
  async login(email: string, password: string): Promise<any> {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const url = `${baseUrl}/auth/login`;
    
    try {
      const response = await firstValueFrom(
        this.http.post<any>(url, { email, password })
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
   * Cierra la sesión activa
   */
  logout() {
    this.sesionService.clearSession();
  }
}
