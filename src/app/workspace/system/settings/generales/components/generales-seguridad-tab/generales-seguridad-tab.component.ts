import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@system-shared/ui/modal/modal.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ControlComponent } from '@system-shared/control/control.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralBubbleComponent } from '@system-shared/ui/general-bubble/general-bubble.component';
import { ListboxComponent } from '@system-shared/form/listbox/listbox.component';
import { ListboxOption } from '@system-shared/form/listbox/base-listbox.directive';
import { GeneralesService } from '../../generales.service';
import { MaintenanceModalComponent } from './maintenance-modal.component';
import { ForcePasswordModalComponent } from './force-password-modal.component';

@Component({
  selector: 'generales-seguridad-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleComponent, ControlComponent, ActionButtonComponent, GeneralBubbleComponent, ListboxComponent, MaintenanceModalComponent, ForcePasswordModalComponent],
  templateUrl: './generales-seguridad-tab.component.html'
})
export class GeneralesSeguridadTabComponent implements OnInit {
  private generalesService = inject(GeneralesService);

  sessionTimeout = signal<number>(30); // minutos
  defaultPassword = signal<string>(''); // Contraseña por defecto
  maintenanceModeActive = signal<boolean>(false);

  timeoutOptions: ListboxOption[] = [
    { label: '15 minutos (Seguridad Alta)', value: 15 },
    { label: '30 minutos (Recomendado)', value: 30 },
    { label: '60 minutos (1 Hora)', value: 60 },
    { label: '120 minutos (2 Horas)', value: 120 },
    { label: '240 minutos (4 Horas)', value: 240 },
    { label: '480 minutos (8 Horas)', value: 480 }
  ];
  
  isForcePasswordModalOpen = signal<boolean>(false);
  isForcingPassword = signal<boolean>(false);

  isMaintenanceModalOpen = signal<boolean>(false);
  isSavingMaintenance = signal<boolean>(false);
  requiredMaintenanceWord = computed(() => this.maintenanceModeActive() ? 'ACTIVAR' : 'DETENER');

  isSaving = signal<boolean>(false);
  isLoadingSettings = signal<boolean>(false);
  globalSettings = signal<any>(null);

  ngOnInit() {
    this.loadGlobalSettings();
  }

  async loadGlobalSettings() {
    this.isLoadingSettings.set(true);
    try {
      const data = await this.generalesService.getGlobalSettings();
      if (data) {
        this.globalSettings.set(data);
        this.sessionTimeout.set(Number(data.token_limit || 30));
        this.defaultPassword.set(data.default_password || '');
        this.maintenanceModeActive.set(data.system_lock || false);
      }
    } catch (e) {
      console.error('Error al cargar configuraciones globales del sistema:', e);
    } finally {
      this.isLoadingSettings.set(false);
    }
  }

  async saveSecuritySettings() {
    this.isSaving.set(true);
    const settings = this.globalSettings();
    if (!settings) {
      this.isSaving.set(false);
      return;
    }
    const payload = {
      id: settings.id,
      token_limit: Number(this.sessionTimeout()),
      default_password: this.defaultPassword()
    };
    try {
      const updated = await this.generalesService.updateGlobalSettings(payload);
      if (updated) {
        this.globalSettings.set(updated);
      }
      alert('✅ Ajustes de Sesión y Políticas de Seguridad actualizados.');
    } catch (e: any) {
      console.error('Error al guardar políticas de seguridad:', e);
      alert('No se pudieron guardar las políticas:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSaving.set(false);
    }
  }

  openMaintenanceModal(event?: Event) {
    if (event) {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      if (target) {
        target.checked = this.maintenanceModeActive();
      }
    }
    this.isMaintenanceModalOpen.set(true);
  }

  closeMaintenanceModal() {
    this.isMaintenanceModalOpen.set(false);
  }

  async executeMaintenanceToggle() {
    this.isSavingMaintenance.set(true);
    const active = this.maintenanceModeActive();
    const nextState = !active;
    const settings = this.globalSettings();

    if (settings) {
      const payload = {
        id: settings.id,
        system_lock: nextState
      };
      try {
        const updated = await this.generalesService.updateGlobalSettings(payload);
        if (updated) {
          this.globalSettings.set(updated);
        }
        this.maintenanceModeActive.set(nextState);
        alert(`✅ Modo mantenimiento ${nextState ? 'activado (sistema inactivo)' : 'desactivado (sistema activo)'} con éxito.`);
        this.closeMaintenanceModal();
      } catch (e) {
        console.error('Error al actualizar modo mantenimiento:', e);
        alert('No se pudo cambiar el estado de mantenimiento.');
      } finally {
        this.isSavingMaintenance.set(false);
      }
    } else {
      this.isSavingMaintenance.set(false);
      this.closeMaintenanceModal();
    }
  }

  openForcePasswordModal() {
    this.isForcePasswordModalOpen.set(true);
  }

  closeForcePasswordModal() {
    this.isForcePasswordModalOpen.set(false);
  }

  async executeForceResetPasswords() {
    this.isForcingPassword.set(true);
    const settings = this.globalSettings();
    if (settings) {
      const payload = {
        id: settings.id,
        restore_password: true
      };
      try {
        const updated = await this.generalesService.updateGlobalSettings(payload);
        if (updated) {
          this.globalSettings.set(updated);
        }
        alert('🚨 Comando ejecutado. Todos los usuarios serán forzados a restablecer su contraseña en su próximo inicio de sesión.');
      } catch (e: any) {
        console.error('Error al forzar cambio de contraseña:', e);
        alert('No se pudo ejecutar el comando.');
      } finally {
        this.isForcingPassword.set(false);
        this.closeForcePasswordModal();
      }
    } else {
      this.isForcingPassword.set(false);
      this.closeForcePasswordModal();
    }
  }
}
