import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlComponent } from '@system-shared/control/control.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { FileUploaderComponent } from '@system-shared/media/file-uploader/file-uploader.component';
import { PreviewImageComponent } from '@system-shared/media/preview-image/preview-image.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { TenantService } from '@core/services/tenant.service';
import { InstitutionService } from '../../../../../database/organization/institutions/institution.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ENDPOINT_KEYS } from '@core/api/api-routes.config';
import { ApiRouteService } from '@core/api/api-route.service';
import { buildApiUrl } from '@core/utils/api.utils';
import { ServerImageComponent } from '@system-shared/images/server-image/server-image.component';

@Component({
  selector: 'generales-institucion-tab',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ControlComponent, 
    TitleComponent, 
    FileUploaderComponent, 
    PreviewImageComponent, 
    ActionButtonComponent,
    ServerImageComponent
  ],
  templateUrl: './generales-institucion-tab.component.html'
})
export class GeneralesInstitucionTabComponent implements OnInit {
  private fb = inject(FormBuilder);
  public tenantService = inject(TenantService);
  private institutionService = inject(InstitutionService);
  private http = inject(HttpClient);
  private apiRouteService = inject(ApiRouteService);

  institucionForm!: FormGroup;
  isSaving = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Previews
  logoPreview = signal<string | null>(null);
  escudoPreview = signal<string | null>(null);
  backPreview = signal<string | null>(null);

  constructor() {
    this.institucionForm = this.fb.group({
      name: ['', Validators.required],
      acronym: ['', Validators.required],
      footer: ['']
    });
  }

  ngOnInit() {
    this.loadCurrentInstitution();
  }

  async loadCurrentInstitution() {
    const tenant = this.tenantService.currentTenant();
    if (tenant) {
      this.isLoading.set(true);
      try {
        const fullTenant = await this.institutionService.getById(tenant.id);
        this.institucionForm.patchValue({
          name: fullTenant.name,
          acronym: fullTenant.acronym,
          footer: fullTenant.footer
        });
        
        const params = { id: tenant.id };
        
        // Actualizamos el tenantService local para que los @if del html pasen
        this.tenantService.updateTenantData({
          id: tenant.id,
          logo: fullTenant.logo || undefined,
          shield: fullTenant.escudo || undefined,
          background: fullTenant.back || undefined
        });

        this.logoPreview.set(fullTenant.logo ? this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getLogo', params) : null);
        this.escudoPreview.set(fullTenant.escudo ? this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getEscudo', params) : null);
        this.backPreview.set(fullTenant.back ? this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getBack', params) : null);
      } catch (e) {
        console.error('Error al cargar datos de la institución:', e);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async onFileSelected(type: 'logo' | 'escudo' | 'back', eventOrFile: any) {
    const file = eventOrFile instanceof File ? eventOrFile : eventOrFile?.target?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ La imagen no debe exceder los 5MB de tamaño.');
        return;
      }
      
      this.isSaving.set(true);
      try {
        const tenant = this.tenantService.currentTenant();
        if (tenant) {
          const formData = new FormData();
          formData.append(type, file);
          
          const updated = await firstValueFrom(this.institutionService.uploadAssets(tenant.id, formData));
          
          // Actualizar vista local con timestamp para forzar recarga de imagen y evitar caché
          const ts = new Date().getTime();
          const params = { id: tenant.id };
          
          if (updated.logo) this.logoPreview.set(`${this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getLogo', params)}?t=${ts}`);
          if (updated.escudo) this.escudoPreview.set(`${this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getEscudo', params)}?t=${ts}`);
          if (updated.back) this.backPreview.set(`${this.apiRouteService.getSpecialRoute(ENDPOINT_KEYS.INSTITUTIONS, 'getBack', params)}?t=${ts}`);
          
          // Refrescar el tenant local para que cambie el layout en tiempo real
          this.tenantService.loadInstitutionsForLogin();
          this.tenantService.setTenant({
            id: updated.id,
            name: updated.name,
            acronym: updated.acronym,
            level: updated.level,
            logo: updated.logo || undefined,
            shield: updated.escudo || undefined,
            background: updated.back || undefined,
            footer: updated.footer || undefined
          } as any);

          alert(`✅ ${type.toUpperCase()} subido y actualizado con éxito.`);
        }
      } catch (e: any) {
        console.error(`Error subiendo ${type}:`, e);
        alert(`No se pudo subir la imagen:\n` + (e?.error?.message || e?.message || 'Error de conexión'));
      } finally {
        this.isSaving.set(false);
      }
    }
  }

  async saveInstitutionSettings() {
    if (this.institucionForm.invalid) return;

    const tenant = this.tenantService.currentTenant();
    if (!tenant) return;

    this.isSaving.set(true);
    
    const payload = this.institucionForm.value;

    try {
      await this.institutionService.update(tenant.id, payload);
      
      // Refrescar TenantService
      this.tenantService.loadInstitutionsForLogin();
      const updated = await this.institutionService.getById(tenant.id);
      this.tenantService.setTenant({
        id: updated.id,
        name: updated.name,
        acronym: updated.acronym,
        level: updated.level,
        logo: updated.logo || undefined,
        shield: updated.escudo || undefined,
        background: updated.back || undefined,
        footer: updated.footer || undefined
      } as any);

      alert('✅ Nombre y acrónimo guardados con éxito.');
    } catch (e: any) {
      console.error('Error al guardar datos de institución:', e);
      alert('No se pudieron guardar los datos:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSaving.set(false);
    }
  }
}
