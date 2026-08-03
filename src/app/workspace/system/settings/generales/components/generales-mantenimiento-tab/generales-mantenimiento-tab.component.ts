import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralesService } from '../../generales.service';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralBubbleComponent } from '@system-shared/ui/general-bubble/general-bubble.component';
import { RangeComponent } from '@system-shared/form/range/range.component';

@Component({
  selector: 'generales-mantenimiento-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleComponent, ActionButtonComponent, GeneralBubbleComponent, RangeComponent],
  templateUrl: './generales-mantenimiento-tab.component.html'
})
export class GeneralesMantenimientoTabComponent implements OnInit {
  private generalesService = inject(GeneralesService);

  fileLimitMB = signal<number>(10);
  isSuperSeedLoading = signal<boolean>(false);
  isPurging = signal<boolean>(false);
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
        this.fileLimitMB.set(data.limit_size_file || 10);
      }
    } catch (e) {
      console.error('Error al cargar configuraciones globales del sistema:', e);
    } finally {
      this.isLoadingSettings.set(false);
    }
  }

  async updateFileLimit(limit: number) {
    this.fileLimitMB.set(limit);
    const settings = this.globalSettings();
    if (!settings) return;
    try {
      const payload = {
        id: settings.id,
        limit_size_file: limit
      };
      const updated = await this.generalesService.updateGlobalSettings(payload);
      if (updated) {
        this.globalSettings.set(updated);
      }
    } catch (e) {
      console.error('Error al actualizar límite de archivo:', e);
    }
  }

  async runSuperSeed() {
    this.isSuperSeedLoading.set(true);
    try {
      await this.generalesService.runSuperSeed();
      await this.loadGlobalSettings();
      alert(`🌱 Súper Semilla ejecutada con éxito. Todos los catálogos y estructuras base han sido creados.`);
    } catch (e: any) {
      console.error(`Error corriendo el Súper Seed:`, e);
      alert(`Ocurrió un error al ejecutar la Súper Semilla:\n` + (e?.error?.message || e?.message || 'Error de conexión'));
    } finally {
      this.isSuperSeedLoading.set(false);
    }
  }

  async purgeOrphanTemporals() {
    this.isPurging.set(true);
    try {
      const report = await this.generalesService.cleanTempFiles();
      const acuses = report?.deleted_acuses !== undefined ? report.deleted_acuses : 0;
      const photos = report?.deleted_profile_photos !== undefined ? report.deleted_profile_photos : 0;
      alert(`🧹 ${report?.message || 'Limpieza completada'}.\n\nSe eliminaron:\n- ${acuses} acuses huérfanos\n- ${photos} fotos de perfil huérfanas`);
    } catch (e: any) {
      console.error('Error al limpiar archivos temporales:', e);
      alert('No se pudo completar la limpieza de temporales:\n' + (e?.error?.message || e?.message || 'Error de conexión'));
    } finally {
      this.isPurging.set(false);
    }
  }
}
