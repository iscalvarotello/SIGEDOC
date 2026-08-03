import { Component, input, output, effect, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignProvider } from '../../../interfaces/sign-provider.interface';
import { ControlComponent } from '@system-shared/control/control.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-sign-provider-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ControlComponent, ActionButtonComponent, IconComponent],
  templateUrl: './sign-provider-detail.component.html',
  host: {
    'class': 'flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm'
  }
})
export class SignProviderDetailComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Input puede ser null (modo creación) o un proveedor existente (modo edición)
  provider = input<SignProvider | null>(null);
  
  // Eventos de guardado y eliminación
  save = output<Partial<SignProvider>>();
  delete = output<string>();
  cancel = output<void>();

  isSaving = input<boolean>(false);
  isDeleting = input<boolean>(false);

  form!: FormGroup;
  isEditMode = signal<boolean>(false);

  constructor() {
    this.initForm();
    
    // Efecto para rellenar el formulario cuando cambia el input
    effect(() => {
      const p = this.provider();
      if (p) {
        this.isEditMode.set(true);
        this.form.patchValue({
          name: p.name,
          code: p.code,
          api_url: p.api_url,
          auth_endpoint: p.auth_endpoint,
          sign_endpoint: p.sign_endpoint,
          apiUser: p.credentials?.apiUser || '',
          apiPassword: p.credentials?.apiPassword || ''
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  ngOnInit() {
    // Si no hay input al inicio, nos aseguramos de que esté limpio
    if (!this.provider()) {
      this.form.reset();
    }
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
      api_url: ['', [Validators.required, Validators.pattern(/https?:\/\/[^\s]+/)]],
      auth_endpoint: ['', Validators.required],
      sign_endpoint: ['', Validators.required],
      apiUser: ['', Validators.required],
      apiPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const val = this.form.value;
    const payload: Partial<SignProvider> = {
      name: val.name,
      code: val.code,
      api_url: val.api_url,
      auth_endpoint: val.auth_endpoint,
      sign_endpoint: val.sign_endpoint,
      credentials: {
        apiUser: val.apiUser,
        apiPassword: val.apiPassword
      }
    };

    this.save.emit(payload);
  }

  onDelete() {
    const p = this.provider();
    if (p && confirm(`¿Estás seguro de que deseas eliminar el proveedor "${p.name}"? Esta acción no se puede deshacer y romperá los ajustes si está activo.`)) {
      this.delete.emit(p.id);
    }
  }
}
