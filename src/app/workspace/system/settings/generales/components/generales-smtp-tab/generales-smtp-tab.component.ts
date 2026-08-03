import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralesService } from '../../generales.service';

@Component({
  selector: 'generales-smtp-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TitleComponent, ControlComponent, ActionButtonComponent],
  templateUrl: './generales-smtp-tab.component.html'
})
export class GeneralesSmtpTabComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generalesService = inject(GeneralesService);

  smtpForm!: FormGroup;
  isSaving = signal<boolean>(false);
  isLoadingSettings = signal<boolean>(false);
  globalSettings = signal<any>(null);

  constructor() {
    this.smtpForm = this.fb.group({
      host: ['smtp.gmail.com', Validators.required],
      port: [465, [Validators.required, Validators.min(1)]],
      username: ['notificaciones@sigedoc.gob.mx', [Validators.required, Validators.email]],
      password: ['••••••••••••••••', Validators.required],
      active_notifications: [true]
    });
  }

  ngOnInit() {
    this.loadGlobalSettings();
  }

  async loadGlobalSettings() {
    this.isLoadingSettings.set(true);
    try {
      const data = await this.generalesService.getGlobalSettings();
      if (data) {
        this.globalSettings.set(data);
        this.smtpForm.patchValue({
          host: data.host_smtp || '',
          port: data.port_smtp || 465,
          username: data.user_smtp || '',
          password: data.pass_smtp || '',
          active_notifications: data.switch_smtp !== undefined ? data.switch_smtp : true
        });
      }
    } catch (e) {
      console.error('Error al cargar configuraciones globales del sistema:', e);
    } finally {
      this.isLoadingSettings.set(false);
    }
  }

  async saveSmtpSettings() {
    if (this.smtpForm.invalid) return;
    this.isSaving.set(true);
    
    const val = this.smtpForm.value;
    const settings = this.globalSettings();
    const payload = {
      id: settings?.id,
      host_smtp: val.host,
      port_smtp: val.port ? String(val.port) : null,
      user_smtp: val.username,
      pass_smtp: val.password,
      switch_smtp: val.active_notifications
    };

    try {
      const updated = await this.generalesService.updateGlobalSettings(payload);
      if (updated) {
        this.globalSettings.set(updated);
      }
      alert('✅ Parámetros de notificaciones SMTP guardados con éxito.');
    } catch (e: any) {
      console.error('Error al guardar SMTP:', e);
      alert('No se pudo guardar la configuración SMTP:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSaving.set(false);
    }
  }
}
