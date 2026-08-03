import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseFormController } from '@baseclass/base-form.controller';
import { DynamicFormComponent } from '@system-shared/dynamic-form/dynamic-form.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { CancelButtonComponent } from '@system-shared/buttons/index';
import { FileUploaderComponent } from '@system-shared/media/file-uploader/file-uploader.component';
import { InstitutionDTO } from '../institution.dto';
import { InstitutionService } from '../institution.service';
import { INSTITUTION_FORM_CONFIG } from './institution-form.config';
import { ENDPOINT_KEYS, ApiRouteConfig } from '@core/api/api-routes.config';
import { buildApiUrl } from '@core/utils/api.utils';
import { BranchService } from '../../branches/branch.service';
import { BranchDTO } from '../../branches/branch.dto';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent, IconComponent, CancelButtonComponent, FileUploaderComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Editar Institución' : 'Nueva Institución' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Complete el formulario para registrar o actualizar los datos y bienes de la institución.
          </p>
        </div>
      </div>

      @if (globalErrors().length > 0) {
        <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div class="flex gap-3">
            <icon icon="AlertTriangle" class="w-5 h-5 text-red-500 shrink-0"></icon>
            <div>
              <h4 class="text-sm font-semibold text-red-800">No se pudo guardar la información:</h4>
              <ul class="mt-1 list-disc list-inside text-sm text-red-700">
                @for (error of globalErrors(); track error) {
                  <li>{{ error }}</li>
                }
              </ul>
            </div>
          </div>
        </div>
      }

      @if (isLoading() || isUploading) {
        <div class="flex flex-col justify-center items-center py-12 gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
          <p class="text-sm text-gray-500 font-medium">{{ isUploading ? 'Subiendo imágenes...' : 'Cargando datos...' }}</p>
        </div>
      } @else {
        <app-dynamic-form 
          [config]="formConfig" 
          [formGroup]="form"
          [isEditMode]="isEditMode()">
        </app-dynamic-form>

        <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-theme-primary inline-block pb-1">Bienes Institucionales (Imágenes)</h3>
            <p class="text-xs text-gray-500 mt-2">Seleccione las imágenes que representarán a esta institución (Logo, Escudo, Fondo). Estas imágenes reemplazarán la vista predeterminada de {{ appSettings.SYSTEM_NAME }}.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Logo -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Logotipo Institucional</label>
              @if (form.get('logo')?.value && !pendingLogo) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img [src]="form.get('logo')?.value" class="w-full h-32 object-contain bg-gray-50 p-2" alt="Logo actual">
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="clearImage('logo')" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cambiar Logo</button>
                  </div>
                </div>
              } @else if (pendingLogo) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 h-32 p-4">
                  <p class="text-sm font-medium text-theme-primary truncate w-full text-center" [title]="pendingLogo.name">{{ pendingLogo.name }}</p>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="pendingLogo = null" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cancelar</button>
                  </div>
                </div>
              } @else {
                <app-file-uploader
                  accept="image/*"
                  iconName="Image"
                  dragLabel="Logo Institucional"
                  helpLabel="Recomendado: PNG transparente"
                  (fileSelected)="onFileSelected('logo', $event)">
                </app-file-uploader>
              }
            </div>

            <!-- Escudo -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Escudo / Sello</label>
              @if (form.get('escudo')?.value && !pendingEscudo) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img [src]="form.get('escudo')?.value" class="w-full h-32 object-contain bg-gray-50 p-2" alt="Escudo actual">
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="clearImage('escudo')" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cambiar Escudo</button>
                  </div>
                </div>
              } @else if (pendingEscudo) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 h-32 p-4">
                  <p class="text-sm font-medium text-theme-primary truncate w-full text-center" [title]="pendingEscudo.name">{{ pendingEscudo.name }}</p>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="pendingEscudo = null" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cancelar</button>
                  </div>
                </div>
              } @else {
                <app-file-uploader
                  accept="image/*"
                  iconName="Shield"
                  dragLabel="Escudo Oficial"
                  helpLabel="Recomendado: PNG cuadrado"
                  (fileSelected)="onFileSelected('escudo', $event)">
                </app-file-uploader>
              }
            </div>

            <!-- Back (Fondo) -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Imagen de Fondo (Opcional)</label>
              @if (form.get('back')?.value && !pendingBack) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img [src]="form.get('back')?.value" class="w-full h-32 object-cover bg-gray-50" alt="Fondo actual">
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="clearImage('back')" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cambiar Fondo</button>
                  </div>
                </div>
              } @else if (pendingBack) {
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 h-32 p-4">
                  <p class="text-sm font-medium text-theme-primary truncate w-full text-center" [title]="pendingBack.name">{{ pendingBack.name }}</p>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" (click)="pendingBack = null" class="px-3 py-1 bg-red-600 text-white rounded shadow text-xs font-medium hover:bg-red-700">Cancelar</button>
                  </div>
                </div>
              } @else {
                <app-file-uploader
                  accept="image/*"
                  iconName="Image"
                  dragLabel="Fondo / Textura"
                  helpLabel="Recomendado: JPG o WebP"
                  (fileSelected)="onFileSelected('back', $event)">
                </app-file-uploader>
              }
            </div>
          </div>
        </div>

        @if (isEditMode()) {
          <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div class="mb-6 flex justify-between items-center">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-theme-primary inline-block pb-1">Sedes Físicas (Sucursales)</h3>
                <p class="text-xs text-gray-500 mt-2">Seleccione las sedes físicas que operan bajo la jurisdicción de esta Institución.</p>
              </div>
              <button 
                type="button" 
                (click)="saveBranches()"
                [disabled]="isSavingBranches"
                class="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700  rounded shadow-sm transition-all flex items-center gap-2">
                @if (isSavingBranches) {
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                } @else {
                  <icon icon="SaveDisk" class="w-4 h-4"></icon>
                }
                Guardar Sedes
              </button>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              @if (allBranches.length === 0) {
                <p class="text-sm text-gray-500 text-center py-4">No hay sedes físicas registradas en el sistema global.</p>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  @for (branch of allBranches; track branch.id) {
                    <label class="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm cursor-pointer hover:border-theme-primary transition-colors">
                      <input 
                        type="checkbox" 
                        class="mt-0.5 rounded text-theme-primary focus:ring-theme-primary"
                        [checked]="isBranchAssigned(branch.id)"
                        (change)="toggleBranch(branch.id, $event)">
                      <div class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ branch.name }}</span>
                        <span class="text-xs text-gray-500">{{ $any(branch.city)?.name }}, {{ $any(branch.city)?.state?.name }}</span>
                      </div>
                    </label>
                  }
                </div>
              }
            </div>
          </div>
        }

        <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
          <cancel-button (clicked)="onCancel()" label="Cancelar"></cancel-button>
          <button 
            type="button" 
            (click)="onSaveCustom()"
            
            class="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary hover:bg-[#5a1528]   rounded-lg shadow-sm transition-all flex items-center gap-2">
            <icon icon="SaveDisk" class="w-4 h-4"></icon>
            Guardar Institución
          </button>
        </div>
      }
    </div>
  `
})
export class InstitutionFormComponent extends BaseFormController<InstitutionDTO> {
  appSettings = APP_SETTINGS;
  protected apiService = inject(InstitutionService);
  protected controllerConfig = INSTITUTION_FORM_CONFIG;
  private http = inject(HttpClient);
  private branchService = inject(BranchService);

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
      console.error('Error cargando branches', error);
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
    } catch (error) {
      console.error('Error al guardar datos/imágenes:', error);
      this.isUploading = false;
      this.globalErrors.set(['Ocurrió un error al guardar la información o subir las imágenes.']);
    }
  }
}
