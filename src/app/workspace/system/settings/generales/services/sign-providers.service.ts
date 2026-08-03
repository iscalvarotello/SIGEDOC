import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { SignProvider } from '../interfaces/sign-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class SignProvidersService {
  private http = inject(HttpClient);
  
  private get baseUrl() {
    return environment.URL_PATH.replace(/\/$/, '');
  }

  async getProviders(): Promise<SignProvider[]> {
    const url = `${this.baseUrl}/signatures/providers`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  async createProvider(payload: Partial<SignProvider>): Promise<SignProvider> {
    const url = `${this.baseUrl}/signatures/providers`;
    const res = await firstValueFrom(this.http.post<any>(url, payload));
    return res && res.data !== undefined ? res.data : res;
  }

  async updateProvider(id: string, payload: Partial<SignProvider>): Promise<SignProvider> {
    const url = `${this.baseUrl}/signatures/providers/${id}`;
    const res = await firstValueFrom(this.http.patch<any>(url, payload));
    return res && res.data !== undefined ? res.data : res;
  }

  async deleteProvider(id: string): Promise<any> {
    const url = `${this.baseUrl}/signatures/providers/${id}`;
    const res = await firstValueFrom(this.http.delete<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }

  async getXmlKeys(): Promise<{ key: string, label: string }[]> {
    const url = `${this.baseUrl}/signatures/providers/xml-keys`;
    const res = await firstValueFrom(this.http.get<any>(url));
    return res && res.data !== undefined ? res.data : res;
  }
}
