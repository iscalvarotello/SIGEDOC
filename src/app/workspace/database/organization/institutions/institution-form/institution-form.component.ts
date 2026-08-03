import { Component, inject       } from '@angular/core';
import { CommonModule            } from '@angular/common';
import { ReactiveFormsModule     } from '@angular/forms';
import { HttpClient              } from '@angular/common/http';
import { firstValueFrom          } from 'rxjs';

import { APP_SETTINGS            } from '@metasystem/settings/app.settings';
import { BaseFormController      } from '@baseclass/base-form.controller';
import { DynamicFormComponent    } from '@system-shared/dynamic-form/dynamic-form.component';
import { IconComponent           } from '@system-shared/common/icon/icon.component';
import { CancelButtonComponent   } from '@system-shared/buttons/index';
import { FileUploaderComponent   } from '@system-shared/media/file-uploader/file-uploader.component';
import { ServerImageComponent    } from '@system-shared/images/server-image/server-image.component';
import { TenantService           } from '@core/services/tenant.service';
import { ApiRouteService         } from '@app/core/api/api-route.service';

import { InstitutionDTO          } from '../institution.dto';
import { InstitutionService      } from '../institution.service';
import { INSTITUTION_FORM_CONFIG } from './institution-form.config';
import { BranchService           } from '../../branches/branch.service';
import { BranchDTO               } from '../../branches/branch.dto';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, IconComponent, CancelButtonComponent, FileUploaderComponent, ServerImageComponent],
  templateUrl: './institution-form.component.html'
})
export class InstitutionFormComponent extends BaseFormController<InstitutionDTO> {
  appSettings = APP_SETTINGS;
  protected apiService = inject(InstitutionService);
  protected controllerConfig = INSTITUTION_FORM_CONFIG;
  private http = inject(HttpClient);
  private branchService = inject(BranchService);
  private tenantService = inject(TenantService);
  private apiRouteService = inject(ApiRouteService);

  isUploading = false;
  isSavingBranches = false;

  pendingLogo: File | null = null;
  pendingEscudo: File | null = null;
  pendingBack: File | null = null;

  allBranches: BranchDTO[] = [];
  selectedBranchIds = new Set<string>();
  originalBranchIds = new Set<string>();

  override ngOnInit(): void {
    super.ngOnInit();
    // Añadimos los controles para las imágenes al formulario si no existen
    if (!this.form.contains('id')) this.form.addControl('id', this.fb.control(null));
    if (!this.form.contains('logo')) this.form.addControl('logo', this.fb.control(null));
    if (!this.form.contains('escudo')) this.form.addControl('escudo', this.fb.control(null));
    if (!this.form.contains('back')) this.form.addControl('back', this.fb.control(null));
    
    this.loadBranches();
  }

  async loadBranches() {
    try {
      const branches = await this.branchService.getAll();
      this.allBranches = branches?.data || (branches as any) || [];
    } catch (error) {
      console.error('Error cargando sucursales:', error);
    }
  }

  protected override async loadData(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.apiService.getById(id);
      if (data) {
        this.form.patchValue(data);
        if (data.branches) {
          data.branches.forEach((b: any) => {
            this.selectedBranchIds.add(b.id);
            this.originalBranchIds.add(b.id);
          });
        }
      }
    } catch (error) {
      console.error('Error cargando registro:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  isBranchAssigned(branchId: string): boolean {
    return this.selectedBranchIds.has(branchId);
  }

  toggleBranch(branchId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedBranchIds.add(branchId);
    } else {
      this.selectedBranchIds.delete(branchId);
    }
  }

  async saveBranches() {
    if (!this.itemId()) return;
    
    const current = Array.from(this.selectedBranchIds);
    const original = Array.from(this.originalBranchIds);
    
    // Find additions
    const toAdd = current.filter(id => !original.includes(id));
    // Find removals
    const toRemove = original.filter(id => !current.includes(id));

    if (toAdd.length === 0 && toRemove.length === 0) return;

    this.isSavingBranches = true;
    try {
      if (toAdd.length > 0) {
        await firstValueFrom(this.apiService.addBranches(this.itemId()!, toAdd));
      }
      if (toRemove.length > 0) {
        await firstValueFrom(this.apiService.removeBranches(this.itemId()!, toRemove));
      }
      // Update original state
      this.originalBranchIds = new Set(this.selectedBranchIds);
    } catch (error) {
      console.error('Error al guardar sucursales', error);
      this.globalErrors.set(['Ocurrió un error al vincular las sedes físicas.']);
    } finally {
      this.isSavingBranches = false;
    }
  }

  onFileSelected(type: 'logo' | 'escudo' | 'back', file: File) {
    if (type === 'logo') this.pendingLogo = file;
    if (type === 'escudo') this.pendingEscudo = file;
    if (type === 'back') this.pendingBack = file;
  }

  clearImage(type: 'logo' | 'escudo' | 'back') {
    this.form.get(type)?.setValue(null);
  }

  async onSaveCustom() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      // Si hay archivos pendientes, evitamos llamar al guardado base todavía
      // Guardamos el form base primero para obtener el ID de la institución
      // si es que estamos creando una nueva
      await super.onSave();

      // Si tenemos pending files, las subimos
      if (this.pendingLogo || this.pendingEscudo || this.pendingBack) {
        this.isUploading = true;
        
        // El id debería estar disponible ahora si se creó correctamente
        const institutionId = this.itemId();
        if (institutionId) {
          const formData = new FormData();
          if (this.pendingLogo) formData.append('logo', this.pendingLogo);
          if (this.pendingEscudo) formData.append('escudo', this.pendingEscudo);
          if (this.pendingBack) formData.append('back', this.pendingBack);

          const updated = await firstValueFrom(this.apiService.uploadAssets(institutionId, formData));
          
          if (updated) {
            if (updated.logo) this.form.get('logo')?.setValue(updated.logo);
            if (updated.escudo) this.form.get('escudo')?.setValue(updated.escudo);
            if (updated.back) this.form.get('back')?.setValue(updated.back);
          }
        }
        
        this.isUploading = false;
      }

      // Sincronizar el payload de la sesión si la institución guardada es la actual
      if (this.itemId()) {
        this.tenantService.updateTenantData({
          id: this.itemId()!,
          name: this.form.get('name')?.value,
          acronym: this.form.get('acronym')?.value,
          footer: this.form.get('footer')?.value
        });
      }
    } catch (error) {
      console.error('Error al guardar datos/imágenes:', error);
      this.isUploading = false;
      this.globalErrors.set(['Ocurrió un error al guardar la información o subir las imágenes.']);
    }
  }
}