import { APP_SETTINGS } from '@metasystem/settings/app.settings';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSelectComponent } from '@workspace-shared/components/selects/employee-select/employee-select.component';
import { GeneralBubbleComponent } from '@system-shared/ui/general-bubble/general-bubble.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { FileUploaderComponent } from '@system-shared/media/file-uploader/file-uploader.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { SesionService } from '@services/sesion.service';
import { EmployeeService } from '@rh/employees/employee.service';
import { GovSignatureService } from '@core/services/gov-signature.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-firma-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeSelectComponent,
    GeneralBubbleComponent,
    TitleComponent,
    ActionButtonComponent,
    FileUploaderComponent,
    IconComponent
  ],
  templateUrl: './user-firma-tab.component.html'
})
export class UserFirmaTabComponent implements OnInit {
  public sesionService = inject(SesionService);
  private employeeService = inject(EmployeeService);
  private govSignatureService = inject(GovSignatureService);

  selectedFirmaFile = signal<File | null>(null);
  voboFirmaEmployeeId = '';
  selectedVoboFirmaEmployee: any | null = null;
  isSavingFirma = signal<boolean>(false);
  isSavingVoboFirma = signal<boolean>(false);

  employeesCatalog = signal<any[]>([]);
  isLoadingEmployees = signal<boolean>(false);

  ngOnInit() {
    this.initFirmaTab();
  }

  async initFirmaTab() {
    await this.loadEmployeesCatalog();
    const currentUser = this.sesionService.currentUserData();
    const emp = this.sesionService.activeAdscription();
    
    if (currentUser?.vobo?.idempleado) {
      this.voboFirmaEmployeeId = currentUser.vobo.idempleado;
    } else if (emp) {
      this.voboFirmaEmployeeId = emp.vobo_id || emp.id_vobo || '';
    }
    this.resolveVoboFirmaEmployee();
  }

  async loadEmployeesCatalog(forceRefresh = false) {
    if (this.employeesCatalog().length > 0 && !forceRefresh) return;

    this.isLoadingEmployees.set(true);
    try {
      const res = await this.employeeService.getAll(undefined, undefined, forceRefresh);
      this.employeesCatalog.set(res.data || []);
      this.resolveVoboFirmaEmployee();
    } catch (err) {
      console.error('Error al cargar catálogo de empleados:', err);
    } finally {
      this.isLoadingEmployees.set(false);
    }
  }

  resolveVoboFirmaEmployee() {
    if (this.voboFirmaEmployeeId && this.employeesCatalog().length > 0) {
      const emp = this.employeesCatalog().find(e => 
        e.employee_id === this.voboFirmaEmployeeId || e.id_employee === this.voboFirmaEmployeeId || e.id === this.voboFirmaEmployeeId || e.id_empleado === this.voboFirmaEmployeeId
      );
      this.selectedVoboFirmaEmployee = emp || null;
    } else {
      this.selectedVoboFirmaEmployee = null;
    }
  }

  onVoboFirmaSelect(emp: any) {
    if (emp) {
      this.voboFirmaEmployeeId = emp.employee_id || emp.id_employee || emp.id || emp.id_empleado;
      this.selectedVoboFirmaEmployee = emp;
    }
  }

  onVoboFirmaClear() {
    this.voboFirmaEmployeeId = '';
    this.selectedVoboFirmaEmployee = null;
  }

  onFirmaFileSelected(event: any) {
    const file = event.target?.files?.[0];
    this.processFirmaFile(file);
  }

  onFirmaFileDropped(file: File) {
    this.processFirmaFile(file);
  }

  private processFirmaFile(file: File | undefined) {
    console.log('[FirmaTab] Evento de seleccion de archivo disparado.');
    if (file) {
      console.log('[FirmaTab] Archivo seleccionado:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      if (!file.name.endsWith('.p12')) {
        console.warn('[FirmaTab] Validacion fallida: El archivo no termina en .p12');
        alert('Por favor seleccione únicamente archivos con extensión .p12');
        this.selectedFirmaFile.set(null);
        return;
      }
      this.selectedFirmaFile.set(file);
      console.log('[FirmaTab] Archivo p12 cargado al estado reactivo correctamente.');
    } else {
      console.log('[FirmaTab] No se selecciono ningun archivo.');
    }
  }

  async uploadFirmaFile() {
    const file = this.selectedFirmaFile();
    const activeAds = this.sesionService.activeAdscription();
    const currentUser = this.sesionService.currentUserData();
    const employeeId = currentUser?.id_empleado || activeAds?.employee_id || activeAds?.id_employee || activeAds?.id || activeAds?.id_empleado;

    console.log('[FirmaTab] Iniciando proceso de subida...');
    console.log('[FirmaTab] Datos actuales del cliente:', {
      hasFile: !!file,
      fileName: file?.name,
      employeeId: employeeId,
      activeAdscription: activeAds,
      currentUser: currentUser
    });

    if (!file) {
      console.error('[FirmaTab] Abortado: No hay archivo en el estado.');
      return;
    }
    if (!employeeId) {
      console.error('[FirmaTab] Abortado: No se resolvio ningun ID de empleado valido desde la sesion.');
      return;
    }

    this.isSavingFirma.set(true);
    try {
      console.log(`[FirmaTab] Invocando govSignatureService.registerCertificate para empleado ${employeeId}...`);
      const response = await firstValueFrom(this.govSignatureService.registerCertificate(employeeId.toString(), file));
      console.log('[FirmaTab] Peticion HTTP completada exitosamente. Respuesta del servidor:', response);
      alert('Firma electrónica (.p12) resguardada encriptada correctamente.');
      this.selectedFirmaFile.set(null);
      
      // Actualizar el estado del usuario en sesión local
      if (currentUser) {
        console.log('[FirmaTab] Actualizando has_p12 a true en la sesion local.');
        currentUser.has_p12 = true;
        this.sesionService.currentUserData.set({ ...currentUser });
        localStorage.setItem(APP_SETTINGS.STORAGE_USER_DATA, JSON.stringify(currentUser));
      }
    } catch (err: any) {
      console.error('[FirmaTab] Error detectado durante la peticion HTTP:', err);
      console.error('[FirmaTab] Detalles del error:', {
        status: err?.status,
        statusText: err?.statusText,
        message: err?.message,
        errorBody: err?.error
      });
      alert('Error al subir la firma:\n' + (err?.error?.message || err?.message));
    } finally {
      this.isSavingFirma.set(false);
      console.log('[FirmaTab] Proceso de subida finalizado.');
    }
  }

  async saveVoboFirma() {
    const activeAds = this.sesionService.activeAdscription();
    const currentUser = this.sesionService.currentUserData();
    const employeeId = currentUser?.id_empleado || activeAds?.employee_id || activeAds?.id_employee || activeAds?.id || activeAds?.id_empleado;

    if (!employeeId) return;

    this.isSavingVoboFirma.set(true);
    try {
      const voboValue = this.voboFirmaEmployeeId || null;
      await this.employeeService.assignVobo(employeeId, voboValue);
      alert('Visto Bueno individual actualizado exitosamente.');
      
      // Actualizar el estado en sesión local del usuario
      if (currentUser) {
        if (voboValue && this.selectedVoboFirmaEmployee) {
          currentUser.has_vobo = true;
          currentUser.vobo = {
            idempleado: voboValue,
            nombre_vobo: this.selectedVoboFirmaEmployee.fullName || `${this.selectedVoboFirmaEmployee.name || ''} ${this.selectedVoboFirmaEmployee.first_surname || ''} ${this.selectedVoboFirmaEmployee.second_surname || ''}`.trim(),
            puesto_vobo: this.selectedVoboFirmaEmployee.resolvedJobPosition || this.selectedVoboFirmaEmployee.job_name || 'Sin Puesto',
            nombre_area_vobo: this.selectedVoboFirmaEmployee.area || ''
          };
        } else {
          currentUser.has_vobo = false;
          currentUser.vobo = null;
        }
        this.sesionService.currentUserData.set({ ...currentUser });
        localStorage.setItem(APP_SETTINGS.STORAGE_USER_DATA, JSON.stringify(currentUser));
      }

      if (activeAds) {
        activeAds.vobo_id = voboValue;
        activeAds.id_vobo = voboValue;
        this.sesionService.setActiveAdscription(activeAds);
      }
    } catch (err: any) {
      console.error('Error al guardar Visto Bueno:', err);
      alert('Error al actualizar Visto Bueno:\n' + (err?.error?.message || err?.message));
    } finally {
      this.isSavingVoboFirma.set(false);
    }
  }

  getVoboSubtitle(vobo: any): string {
    if (!vobo) return '';
    let subtitle = `Actualmente su Visto Bueno es otorgado por: <br> <b>${vobo.nombre_vobo}</b> <br> <span class="text-[10px] text-emerald-600 dark:text-emerald-500/70"> Puesto: ${vobo.puesto_vobo}`;
    if (vobo.nombre_area_vobo) {
      subtitle += ` | Área: ${vobo.nombre_area_vobo}`;
    }
    subtitle += '</span>';
    return subtitle;
  }
}
