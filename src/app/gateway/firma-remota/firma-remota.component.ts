import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GovSignatureService, TokenValidationResponse } from '@core/services/gov-signature.service';
import { firstValueFrom } from 'rxjs';
import { CountdownTimerComponent } from '@system-shared/common/countdown-timer/countdown-timer.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { SubmitButtonComponent } from '@system-shared/buttons/submit-button/submit-button.component';

@Component({
  selector: 'app-firma-remota',
  standalone: true,
  imports: [CommonModule, FormsModule, CountdownTimerComponent, IconComponent, SubmitButtonComponent],
  templateUrl: './firma-remota.component.html'
})
export class FirmaRemotaComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _govSignature = inject(GovSignatureService);

  token = signal<string | null>(null);
  validationData = signal<TokenValidationResponse | null>(null);
  
  isLoading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);
  successMessage = signal<string | null>(null);

  password = signal<string>('');
  selectedFile = signal<File | null>(null);

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      const t = params['token'];
      if (t) {
        this.token.set(t);
        this.validateToken(t);
      } else {
        this.errorMsg.set('No se proporcionó un token de firma en la URL.');
        this.isLoading.set(false);
      }
    });
  }

  async validateToken(token: string) {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(this._govSignature.validateToken(token));
      if (res && res.isValid) {
        this.validationData.set(res);
      } else {
        this.errorMsg.set('El token de firma no es válido o ha expirado.');
      }
    } catch (e: any) {
      console.error(e);
      this.errorMsg.set(e?.error?.message || 'Error al validar el enlace de firma.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile.set(target.files[0]);
    } else {
      this.selectedFile.set(null);
    }
  }

  handleTokenExpired() {
    this.errorMsg.set('El token de firma ha expirado. Por favor, genere un nuevo enlace desde SIGEDOC.');
    this.validationData.set(null);
  }

  async submitSignature() {
    const t = this.token();
    const f = this.selectedFile();
    const p = this.password();
    const hasCert = this.validationData()?.hasCertificate;

    if (!t || !p || (!f && !hasCert)) {
      alert('Por favor ingrese su contraseña y verifique contar con el certificado (.p12).');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this._govSignature.submitCertificate(t, p, f));
      this.successMessage.set('¡Firma electrónica procesada exitosamente!');
    } catch (e: any) {
      console.error(e);
      alert(e?.error?.message || 'Hubo un error al procesar la firma.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
