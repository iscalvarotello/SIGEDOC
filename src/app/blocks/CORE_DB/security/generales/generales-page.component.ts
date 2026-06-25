import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { SVG_ICONS } from '../../../../shared/icons/svg-icons';
import { GeneralesService } from './generales.service';

@Component({
  selector: 'app-generales-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, SafeHtmlPipe],
  templateUrl: './generales-page.component.html'
})
export class GeneralesPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generalesService = inject(GeneralesService);

  // Tab activa del Panel
  activeTab = signal<'documentos' | 'minutarios' | 'smtp' | 'mantenimiento' | 'seguridad'>('documentos');

  // Estados Generales de Carga y Acción
  isSaving = signal<boolean>(false);
  isLoadingSettings = signal<boolean>(false);
  
  // ============================================
  // TAB 1: DOCUMENTOS Y FIRMAS
  // ============================================
  documentosForm!: FormGroup;
  membretePreview = signal<string | null>(null);

  // ============================================
  // TAB 2: MINUTARIOS Y FOLIOS REAL
  // ============================================
  globalMinutarios = signal<any[]>([]);
  areasMinutarios = signal<any[]>([]);
  selectedYear = signal<number>(new Date().getFullYear());
  showGestDocs = signal<boolean>(false);
  isLoadingMinutarios = signal<boolean>(false);
  isLoadingAreas = signal<boolean>(false);

  availableYears = computed(() => {
    const years = this.globalMinutarios().map(m => m.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  });

  isAjusteModalOpen = signal<boolean>(false);
  ajusteForm!: FormGroup;
  isAdjusting = signal<boolean>(false);

  // Configuraciones globales cargadas del backend
  globalSettings = signal<any>(null);

  // ============================================
  // TAB 3: SMTP CORREO
  // ============================================
  smtpForm!: FormGroup;
  showSmtpPassword = signal<boolean>(false);

  // ============================================
  // TAB 4: MANTENIMIENTO Y SEEDS
  // ============================================
  fileLimitMB = signal<number>(10);
  isLoadingSeeds = signal<Record<string, boolean>>({
    system: false,
    location: false,
    organization: false,
    logistic: false,
    rh: false,
    documents: false
  });
  isPurging = signal<boolean>(false);

  // ============================================
  // TAB 5: SEGURIDAD Y SESIÓN
  // ============================================
  sessionTimeout = signal<number>(30); // minutos
  defaultPassword = signal<string>(''); // Contraseña por defecto
  maintenanceModeActive = signal<boolean>(false);
  isForcePasswordModalOpen = signal<boolean>(false);
  isForcingPassword = signal<boolean>(false);
  confirmForceWord = signal<string>('');

  isMaintenanceModalOpen = signal<boolean>(false);
  confirmMaintenanceWord = signal<string>('');
  isSavingMaintenance = signal<boolean>(false);
  requiredMaintenanceWord = computed(() => this.maintenanceModeActive() ? 'ACTIVAR' : 'DETENER');

  constructor() {
    this.initForms();
  }

  ngOnInit() {
    this.loadSignatureSettings();
    // Cargar preview inicial del membrete
    this.membretePreview.set(this.generalesService.getBackgroundUrl(Date.now()));
    // Cargar minutarios
    this.loadMinutariosData();
    // Cargar configuración global del sistema
    this.loadGlobalSettings();
  }

  private initForms() {
    // Formulario de Documentos (Campos alineados con el Backend)
    this.documentosForm = this.fb.group({
      qr_validation_url: ['https://sigedoc.gob.mx/valida', [Validators.required, Validators.pattern(/https?:\/\/[^\s]+/)]],
      offset_y: [80, [Validators.required, Validators.min(0), Validators.max(300)]],
      margin_x: [50, [Validators.required, Validators.min(0), Validators.max(200)]],
      legend_footnote: ['El presente documento ha sido firmado electrónicamente de conformidad con la Ley de Firma Electrónica Avanzada vigente en el Estado de Chiapas.', Validators.required],
      legend_acuse: ['Documento oficial de acuse de recibo generado por el Sistema de Control Documental.', Validators.required]
    });

    // Formulario de Ajuste Manual de Minutarios
    this.ajusteForm = this.fb.group({
      anio: [2026, Validators.required],
      scope: ['specific', Validators.required],
      areaId: [''],
      tipo: ['oficio', Validators.required],
      nuevo_valor: [0, [Validators.required, Validators.min(0)]],
      admin_password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // Formulario de Servidor SMTP
    this.smtpForm = this.fb.group({
      host: ['smtp.gmail.com', Validators.required],
      port: [465, [Validators.required, Validators.min(1)]],
      username: ['notificaciones@sigedoc.gob.mx', [Validators.required, Validators.email]],
      password: ['••••••••••••••••', Validators.required],
      active_notifications: [true]
    });
  }

  // Helper para Iconos
  getIconSvg(name: string): string {
    return (SVG_ICONS as any)[name] || '';
  }

  // Pestañas
  setTab(tab: 'documentos' | 'minutarios' | 'smtp' | 'mantenimiento' | 'seguridad') {
    this.activeTab.set(tab);
  }

  // ============================================
  // LOGICA TAB 1: DOCUMENTOS Y FIRMAS REAL
  // ============================================
  async loadSignatureSettings() {
    this.isLoadingSettings.set(true);
    try {
      const data = await this.generalesService.getSignatureSettings();
      if (data) {
        this.documentosForm.patchValue({
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

  async onMembreteSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ El membrete no debe exceder los 5MB de tamaño.');
        return;
      }
      
      this.isSaving.set(true);
      try {
        await this.generalesService.uploadBackground(file);
        // Forzar recarga de preview con cache busting timestamp
        this.membretePreview.set(this.generalesService.getBackgroundUrl(Date.now()));
        alert('✅ Membrete oficial subido y reemplazado con éxito.');
      } catch (e: any) {
        console.error('Error subiendo membrete:', e);
        alert('No se pudo subir el membrete:\n' + (e?.error?.message || e?.message || 'Error de conexión'));
      } finally {
        this.isSaving.set(false);
      }
    }
  }

  async saveDocumentSettings() {
    if (this.documentosForm.invalid) return;
    this.isSaving.set(true);
    
    const val = this.documentosForm.value;
    const payload = {
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

  // ============================================
  // EVENTOS TAB 2: MINUTARIOS (POR AHORA MOCK)
  // ============================================
  // ============================================
  // EVENTOS TAB 2: MINUTARIOS (REAL Y SELECCIONADOR)
  // ============================================
  async loadMinutariosData() {
    this.isLoadingMinutarios.set(true);
    try {
      const data = await this.generalesService.getGlobalMinutarios();
      this.globalMinutarios.set(data || []);
      
      const years = (data || []).map((m: any) => m.year);
      if (years.length > 0) {
        if (!years.includes(this.selectedYear())) {
          const maxYear = Math.max(...years);
          this.selectedYear.set(maxYear);
        }
      }
      await this.loadAreasMinutarios(this.selectedYear());
    } catch (e) {
      console.error('Error al cargar minutarios globales:', e);
    } finally {
      this.isLoadingMinutarios.set(false);
    }
  }

  async loadAreasMinutarios(year: number) {
    this.isLoadingAreas.set(true);
    try {
      const data = await this.generalesService.getAreasMinutarios(year);
      this.areasMinutarios.set(data || []);
    } catch (e) {
      console.error(`Error al cargar minutarios de áreas del año ${year}:`, e);
      this.areasMinutarios.set([]);
    } finally {
      this.isLoadingAreas.set(false);
    }
  }

  async onYearSelectedChange(year: any) {
    const y = Number(year);
    this.selectedYear.set(y);
    await this.loadAreasMinutarios(y);
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
        this.fileLimitMB.set(data.limit_size_file || 10);
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

  onTimeoutChange(event: any) {
    const val = Number(event.target.value);
    this.sessionTimeout.set(val);
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

  async openNewFiscalYear() {
    const years = this.globalMinutarios().map(m => m.year);
    const nextYear = years.length > 0 ? Math.max(...years) + 1 : new Date().getFullYear();

    if (confirm(`📅 ¿Estás seguro de que deseas inicializar el Año Fiscal ${nextYear}?\nEsto ejecutará el proceso de cambio de ciclo en el servidor.`)) {
      this.isSaving.set(true);
      try {
        await this.generalesService.prepareNewYear(nextYear);
        alert(`✅ ¡Año Fiscal ${nextYear} inicializado con éxito!`);
        await this.loadMinutariosData();
        this.selectedYear.set(nextYear);
        await this.loadAreasMinutarios(nextYear);
      } catch (e: any) {
        console.error('Error al crear año nuevo fiscal:', e);
        alert('No se pudo crear el año fiscal:\n' + (e?.error?.message || e?.message || 'Error de conexión'));
      } finally {
        this.isSaving.set(false);
      }
    }
  }

  openAjusteModal() {
    const defaultTipo = this.showGestDocs() ? 'oficio_gest' : 'oficio';
    this.ajusteForm.patchValue({ 
      admin_password: '',
      tipo: defaultTipo
    });
    this.isAjusteModalOpen.set(true);
  }

  closeAjusteModal() {
    this.isAjusteModalOpen.set(false);
  }

  async executeContadorAdjustment() {
    if (this.ajusteForm.invalid) return;
    const val = this.ajusteForm.value;

    if (val.scope === 'specific' && !val.areaId) {
      alert('Debe seleccionar un área para el ajuste específico.');
      return;
    }

    this.isAdjusting.set(true);
    try {
      await this.generalesService.adjustMinutario({
        year: Number(val.anio),
        type: val.tipo,
        newValue: Number(val.nuevo_valor),
        scope: val.scope,
        areaId: val.scope === 'specific' ? val.areaId : undefined
      });
      
      // Recargar datos de minutarios para refrescar la tabla del UI
      await this.loadMinutariosData();

      this.closeAjusteModal();
      alert(`✅ Folio de ${val.tipo.toUpperCase()} ajustado correctamente en la base de datos.`);
    } catch (err: any) {
      console.error('Error al ajustar minutario:', err);
      alert(
        err?.error?.message || 
        err?.message || 
        'Ocurrió un error al intentar ajustar el minutario en la base de datos.'
      );
    } finally {
      this.isAdjusting.set(false);
    }
  }

  // ============================================
  // EVENTOS TAB 3: SMTP (POR AHORA MOCK)
  // ============================================
  toggleSmtpPassword() {
    this.showSmtpPassword.set(!this.showSmtpPassword());
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

  // ============================================
  // EVENTOS TAB 4: MANTENIMIENTO REAL SEED
  // ============================================
  async runCatalogSeed(type: 'system' | 'location' | 'organization' | 'logistic' | 'rh' | 'documents') {
    this.isLoadingSeeds.update(prev => ({ ...prev, [type]: true }));
    try {
      await this.generalesService.runSeed(type);
      
      // Acciones adicionales tras éxito
      if (type === 'system') {
        await this.loadSignatureSettings();
        await this.loadGlobalSettings();
      } else if (type === 'documents') {
        await this.loadMinutariosData();
      }
      
      alert(`🌱 Semilla de '${this.getSeedLabel(type)}' ejecutada con éxito.`);
    } catch (e: any) {
      console.error(`Error corriendo seed ${type}:`, e);
      alert(`Ocurrió un error al ejecutar la semilla de ${this.getSeedLabel(type)}:\n` + (e?.error?.message || e?.message || 'Error de conexión'));
    } finally {
      this.isLoadingSeeds.update(prev => ({ ...prev, [type]: false }));
    }
  }

  // Helper para mostrar nombres bonitos en la alerta
  getSeedLabel(type: string): string {
    switch (type) {
      case 'system': return 'Sistema';
      case 'location': return 'Geografía (Países/Estados/Ciudades)';
      case 'organization': return 'Organización (Áreas/Sucursales)';
      case 'logistic': return 'Logística (Casetas/Tarifas/Vehículos)';
      case 'rh': return 'Capital Humano (Empleados/Adscripciones)';
      case 'documents': return 'Documentación (Templates/Minutarios)';
      default: return type;
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


  // ============================================
  // EVENTOS TAB 5: SEGURIDAD (REAL)
  // ============================================
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

  openMaintenanceModal() {
    this.confirmMaintenanceWord.set('');
    this.isMaintenanceModalOpen.set(true);
  }

  closeMaintenanceModal() {
    this.isMaintenanceModalOpen.set(false);
  }

  async executeMaintenanceToggle() {
    const required = this.requiredMaintenanceWord();
    if (this.confirmMaintenanceWord() !== required) {
      alert(`Debe escribir la palabra "${required}" exactamente para continuar.`);
      return;
    }

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
    this.confirmForceWord.set('');
    this.isForcePasswordModalOpen.set(true);
  }

  closeForcePasswordModal() {
    this.isForcePasswordModalOpen.set(false);
  }

  async executeForceResetPasswords() {
    if (this.confirmForceWord().toLowerCase() !== 'forzar') {
      alert('Debe escribir la palabra "FORZAR" exactamente para continuar.');
      return;
    }

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
