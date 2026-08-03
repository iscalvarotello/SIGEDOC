import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlComponent } from '@system-shared/control/control.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { GeneralesService } from '../../generales.service';
import { SignProvidersService } from '../../services/sign-providers.service';
import { SignProvider } from '../../interfaces/sign-provider.interface';
import { SignProviderListComponent } from '../sign-providers/sign-provider-list/sign-provider-list.component';
import { SignProviderDetailComponent } from '../sign-providers/sign-provider-detail/sign-provider-detail.component';
import { SignProviderXmlEditorComponent } from '../sign-providers/sign-provider-xml-editor/sign-provider-xml-editor.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { EmptyStateComponent } from '@system-shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'generales-documentos-tab',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ControlComponent, 
    TitleComponent, 
    ActionButtonComponent,
    SignProviderListComponent,
    SignProviderDetailComponent,
    SignProviderXmlEditorComponent,
    EmptyStateComponent
  ],
  templateUrl: './generales-documentos-tab.component.html'
})
export class GeneralesDocumentosTabComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generalesService = inject(GeneralesService);
  private signProvidersService = inject(SignProvidersService);

  documentosForm!: FormGroup;
  isSaving = signal<boolean>(false);
  isLoadingSettings = signal<boolean>(false);

  // Sign Providers State
  providers = signal<SignProvider[]>([]);
  isLoadingProviders = signal<boolean>(false);
  selectedProvider = signal<SignProvider | null>(null);
  showProviderForm = signal<boolean>(false);
  isSavingProvider = signal<boolean>(false);
  isDeletingProvider = signal<boolean>(false);

  constructor() {
    this.documentosForm = this.fb.group({
      active_provider_id: [null], // null = local
      offset_y: [80, [Validators.required, Validators.min(0), Validators.max(300)]],
      margin_x: [50, [Validators.required, Validators.min(0), Validators.max(200)]],
      legend_footnote: ['El presente documento ha sido firmado electrónicamente de conformidad con la Ley de Firma Electrónica Avanzada vigente en el Estado de Chiapas.', Validators.required],
      legend_acuse: ['Documento oficial de acuse de recibo generado por el Sistema de Control Documental.', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSignatureSettings();
    this.loadProviders();
  }

  async loadSignatureSettings() {
    this.isLoadingSettings.set(true);
    try {
      const data = await this.generalesService.getSignatureSettings();
      if (data) {
        this.documentosForm.patchValue({
          active_provider_id: data.active_provider_id || null,
          offset_y: data.offset_y !== undefined ? data.offset_y : 80,
          margin_x: data.margin_x !== undefined ? data.margin_x : 50,
          legend_footnote: data.legend_footnote || '',
          legend_acuse: data.legend_acuse || ''
        });
      }
    } catch (e) {
      console.error('Error al cargar configuraciones de firmas:', e);
    } finally {
      this.isLoadingSettings.set(false);
    }
  }

  // --- CRUD Proveedores ---

  async loadProviders() {
    this.isLoadingProviders.set(true);
    try {
      const provs = await this.signProvidersService.getProviders();
      this.providers.set(provs || []);
    } catch (e) {
      console.error('Error loading providers', e);
    } finally {
      this.isLoadingProviders.set(false);
    }
  }

  selectProvider(p: SignProvider) {
    this.selectedProvider.set(p);
    this.showProviderForm.set(true);
  }

  createProvider() {
    this.selectedProvider.set(null);
    this.showProviderForm.set(true);
  }

  cancelProviderForm() {
    this.showProviderForm.set(false);
    this.selectedProvider.set(null);
  }

  async saveProvider(payload: Partial<SignProvider>) {
    this.isSavingProvider.set(true);
    try {
      const current = this.selectedProvider();
      if (current) {
        await this.signProvidersService.updateProvider(current.id, payload);
      } else {
        await this.signProvidersService.createProvider(payload);
      }
      await this.loadProviders();
      this.cancelProviderForm();
    } catch (e: any) {
      alert('Error guardando proveedor:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSavingProvider.set(false);
    }
  }

  async deleteProvider(id: string) {
    this.isDeletingProvider.set(true);
    try {
      await this.signProvidersService.deleteProvider(id);
      await this.loadProviders();
      
      // Si borramos el proveedor que estaba activo, actualizar settings locales
      if (this.documentosForm.value.active_provider_id === id) {
        this.documentosForm.patchValue({ active_provider_id: null });
      }

      this.cancelProviderForm();
    } catch (e: any) {
      alert('Error eliminando proveedor:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isDeletingProvider.set(false);
    }
  }

  async saveProviderXml(event: { id: string, xml_template: string }) {
    this.isSavingProvider.set(true);
    try {
      await this.signProvidersService.updateProvider(event.id, { xml_template: event.xml_template });
      await this.loadProviders();
      
      // Refresh local selection
      const updated = this.providers().find(p => p.id === event.id);
      if (updated) this.selectedProvider.set(updated);
      
      alert('✅ Plantilla XML actualizada exitosamente.');
    } catch (e: any) {
      alert('Error guardando Plantilla XML:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSavingProvider.set(false);
    }
  }

  async saveDocumentSettings() {
    if (this.documentosForm.invalid) return;

    this.isSaving.set(true);
    
    const val = this.documentosForm.value;
    const payload = {
      active_provider_id: val.active_provider_id || null,
      offset_y: Number(val.offset_y),
      margin_x: Number(val.margin_x),
      legend_footnote: val.legend_footnote,
      legend_acuse: val.legend_acuse
    };

    try {
      await this.generalesService.updateSignatureSettings(payload);
      alert('✅ Parámetros de firma electrónica y leyendas guardados con éxito.');
    } catch (e: any) {
      console.error('Error al guardar configuración de firmas:', e);
      alert('No se pudieron guardar las configuraciones:\n' + (e?.error?.message || e?.message));
    } finally {
      this.isSaving.set(false);
    }
  }
}
