import { Component, OnInit, OnDestroy, inject, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovSignatureService } from '@core/services/gov-signature.service';
import { SubmitButtonComponent } from '@system-shared/buttons/submit-button/submit-button.component';
import { CancelButtonComponent } from '@system-shared/buttons/cancel-button/cancel-button.component';
import { CountdownTimerComponent } from '@system-shared/common/countdown-timer/countdown-timer.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-gov-signature-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SubmitButtonComponent, CancelButtonComponent, CountdownTimerComponent, IconComponent],
  templateUrl: './gov-signature-modal.component.html',
  host: {
    'class': 'block w-full min-w-0'
  }
})
export class GovSignatureModalComponent implements OnInit, OnDestroy {
  // Inputs
  isOpen = input<boolean>(false);
  documentId = input.required<string>();
  curp = input.required<string>();
  idEmpleado = input.required<string>();
  
  
  // Outputs
  onClose = output<void>();
  onSuccess = output<string>(); // Returns the signed document ID or QR url
  
  // Services
  private fb = inject(FormBuilder);
  private govSignatureService = inject(GovSignatureService);
  
  // State
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  // Form
  signForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  
  // Timer State
  expiresAt = signal<Date | null>(null);
  isExpired = signal<boolean>(false);
  
  // File State
  selectedFile = signal<File | null>(null);
  
  ngOnInit() {
    // Si inicia abierto
    if (this.isOpen()) {
      this.startTimer();
    }
  }
  
  ngOnDestroy() {
    // No manual interval to clean up anymore
  }
  
  private startTimer() {
    // 5 minutos desde ahora
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    this.expiresAt.set(date);
    this.isExpired.set(false);
  }
  
  onTimerExpired() {
    this.isExpired.set(true);
    this.errorMessage.set('El tiempo de firma ha expirado. Por favor, cierre la ventana e intente de nuevo.');
  }

  private resetTimer() {
    this.startTimer();
  }
  
  closeModal() {
    if (this.isLoading()) return;
    this.onClose.emit();
  }
  
  onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      if (!file.name.endsWith('.p12')) {
        this.errorMessage.set('Por favor, seleccione únicamente un archivo .p12');
        this.selectedFile.set(null);
        event.target.value = '';
        return;
      }
      this.selectedFile.set(file);
      this.errorMessage.set('');
    }
  }
  
  submit() {
    if (this.signForm.invalid || this.isExpired()) return;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    const request = {
      documentId: this.documentId(),
      curp: this.curp(),
      id_empleado: this.idEmpleado(),
      password: this.signForm.value.password!
    };
    
    if (this.selectedFile()) {
      this.govSignatureService.registerCertificate(this.idEmpleado(), this.selectedFile()!).subscribe({
        next: (res) => {
          if (res && res.success === false) {
             this.isLoading.set(false);
             this.errorMessage.set(res.message || 'Error al subir el certificado.');
             return;
          }
          this.executeSignature(request);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al subir el certificado. ' + (err?.error?.message || ''));
          console.error(err);
        }
      });
    } else {
      this.executeSignature(request);
    }
  }
  
  private executeSignature(request: any) {
    this.govSignatureService.signDocument(request).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          // Aseguramos que la emisión sea fuera del ciclo inmediato si causa problemas
          setTimeout(() => {
            this.onSuccess.emit(res.qrUrl || res.signedDocumentId || '');
            this.closeModal();
          });
        } else {
          this.errorMessage.set(res.message || 'Ocurrió un error al firmar el documento.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error de conexión con el servidor. Intente más tarde.');
        console.error(err);
      }
    });
  }
}
