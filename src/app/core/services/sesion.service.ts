import { Injectable, signal, computed, inject } from '@angular/core';
import { UserSession } from '@interfaces/user-session.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PermissionDTO } from '@security/permissions/permission.dto';
import { SIDEBAR_MENU } from '@core/menu/app.sidebar.menu';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private http = inject(HttpClient);

  // Señales de Estado
  public token = signal<string | null>(localStorage.getItem(APP_SETTINGS.STORAGE_TOKEN));
  public currentUserData = signal<any | null>(JSON.parse(localStorage.getItem(APP_SETTINGS.STORAGE_USER_DATA) || 'null'));
  
  // Adscripción activa
  public activeAdscription = signal<any | null>(JSON.parse(localStorage.getItem(APP_SETTINGS.STORAGE_ACTIVE_ADSCRIPTION) || 'null'));
  
  // Permisos cargados en memoria
  public permissions = signal<PermissionDTO[]>([]);
  
  // Control de refresco de foto de perfil
  public photoTimestamp = signal<number>(Date.now());
  
  public triggerPhotoReload() {
    this.photoTimestamp.set(Date.now());
  }

  // Computed helper para obtener la lista de adscripciones
  public adscriptions = computed(() => this.currentUserData()?.adscriptions || []);

  constructor() {
    // Si al arrancar la app hay sesión, cargar permisos de forma automática
    const user = this.currentUserData();
    if (user && user.system_role_id) {
      this.loadPermissions(user.system_role_id).catch(err => {
        console.error('Error cargando permisos en el arranque:', err);
      });
    }
  }

  /**
   * Guarda los datos de autenticación obtenidos tras el login
   */
  async setSession(loginResponse: { user: any; token: string }) {
    this.token.set(loginResponse.token);
    this.currentUserData.set(loginResponse.user);
    
    localStorage.setItem(APP_SETTINGS.STORAGE_TOKEN, loginResponse.token);
    localStorage.setItem(APP_SETTINGS.STORAGE_USER_DATA, JSON.stringify(loginResponse.user));

    // Por defecto, activar la primera adscripción del colaborador
    const adsList = loginResponse.user.adscriptions || [];
    if (adsList.length > 0) {
      this.setActiveAdscription(adsList[0]);
    } else {
      this.activeAdscription.set(null);
      localStorage.removeItem(APP_SETTINGS.STORAGE_ACTIVE_ADSCRIPTION);
    }

    // Cargar los permisos del rol del sistema
    if (loginResponse.user.system_role_id) {
      await this.loadPermissions(loginResponse.user.system_role_id);
    } else {
      this.permissions.set([]);
    }
  }

  /**
   * Cambia la adscripción (bandeja) activa del usuario
   */
  setActiveAdscription(adscription: any) {
    this.activeAdscription.set(adscription);
    localStorage.setItem(APP_SETTINGS.STORAGE_ACTIVE_ADSCRIPTION, JSON.stringify(adscription));
    
    // Sincronizar el tenant_id con el institution_id de la adscripción si existe
    if (adscription && adscription.institution_id) {
      localStorage.setItem(APP_SETTINGS.STORAGE_TENANT_ID, adscription.institution_id);
    }
  }

  /**
   * Carga los permisos del rol del sistema desde el backend
   */
  async loadPermissions(systemRoleId: number): Promise<void> {
    const baseUrl = environment.URL_PATH.replace(/\/$/, '');
    const url = `${baseUrl}/users/roles/${systemRoleId}/permissions`;
    
    try {
      const response = await firstValueFrom(this.http.get<any>(url));
      const list = response?.data || response || [];
      const parsed = list.map((item: any) => new PermissionDTO(item));
      this.permissions.set(parsed);
    } catch (error) {
      console.error('Error al descargar permisos del rol:', error);
      this.permissions.set([]);
      throw error;
    }
  }

  /**
   * Limpia toda la sesión (Sign Out)
   */
  clearSession() {
    this.token.set(null);
    this.currentUserData.set(null);
    this.activeAdscription.set(null);
    this.permissions.set([]);

    localStorage.removeItem(APP_SETTINGS.STORAGE_TOKEN);
    localStorage.removeItem(APP_SETTINGS.STORAGE_USER_DATA);
    localStorage.removeItem(APP_SETTINGS.STORAGE_ACTIVE_ADSCRIPTION);
  }

  /**
   * Comprueba si el usuario tiene sesión activa
   */
  isLoggedIn(): boolean {
    return !!this.token() && !!this.currentUserData();
  }

  /**
   * Actualiza parcialmente la información de datos_personales del usuario en memoria y localStorage
   */
  updatePersonalData(newPersonalData: any) {
    const user = this.currentUserData();
    if (user) {
      const updatedUser = { ...user };
      updatedUser.datos_personales = { ...updatedUser.datos_personales, ...newPersonalData };
      this.currentUserData.set(updatedUser);
      localStorage.setItem(APP_SETTINGS.STORAGE_USER_DATA, JSON.stringify(updatedUser));
    }
  }


  /**
   * Retorna los datos del usuario mapeados al formato legacy UserSession
   */
  get dataUser(): UserSession {
    const user = this.currentUserData();
    const activeAds = this.activeAdscription();
    
    if (!user) {
      return {
        idUser: 0,
        idRol: 0,
        nombre: '',
        apellido1: '',
        apellido2: '',
        fullName: '',
        nickName: '',
        puesto: '',
        telefono: '',
        extension: '',
        email: '',
        id_area: '',
        nombre_area: '',
        id_area_base: '',
        nombre_area_base: '',
        es_jefe: false,
        es_recepcion: false,
        country_code: '',
        sucursal: '',
        ciudad: '',
        estado: '',
        pais: ''
      };
    }

    const personal = user.datos_personales || {};
    const prefix = personal.prefix ? `${personal.prefix} ` : '';
    
    let puestoStr = '';
    if (activeAds) {
      if (activeAds.job_position) {
        puestoStr = (personal.sex === 'F' && activeAds.job_position.name_fem) 
          ? activeAds.job_position.name_fem 
          : (activeAds.job_position.name || '');
      } else {
        puestoStr = activeAds.area_type_name || '';
      }
    }

    return {
      idUser: user.id_usuario,
      idRol: user.system_role_id || 0,
      nombre: personal.name || '',
      apellido1: personal.first_surname || '',
      apellido2: personal.second_surname || '',
      fullName: `${prefix}${personal.name || ''} ${personal.first_surname || ''} ${personal.second_surname || ''}`.replace(/\s+/g, ' ').trim(),
      nickName: personal.nickname || personal.name || '',
      puesto: puestoStr,
      telefono: personal.phone || '',
      extension: '',
      email: user.email,
      id_area: activeAds ? activeAds.id_area : '',
      nombre_area: activeAds ? activeAds.nombre_area : '',
      id_area_base: activeAds ? activeAds.id_area_base : '',
      nombre_area_base: activeAds ? activeAds.nombre_area_base : '',
      es_jefe: activeAds ? (!!activeAds.is_head || !!activeAds.is_in_charge) : false,
      es_recepcion: activeAds ? !!activeAds.is_reception : false,
      country_code: activeAds?.branch?.city?.state?.country?.phonecode || '52',
      sex: personal.sex || '',
      sucursal: activeAds?.branch?.name || '',
      ciudad: activeAds?.branch?.city?.name || '',
      estado: activeAds?.branch?.city?.state?.name || '',
      pais: activeAds?.branch?.city?.state?.country?.name || ''
    };
  }

  /**
   * Comprueba de manera síncrona si tiene permiso de lectura
   */
  canRead(moduleId: number): boolean {
    const p = this.permissions().find(x => x.module_id === moduleId);
    return p ? p.can_read : false;
  }

  /**
   * Comprueba de manera síncrona si tiene permiso de escritura/actualización
   */
  canUpdate(moduleId: number): boolean {
    const p = this.permissions().find(x => x.module_id === moduleId);
    return p ? p.can_update : false;
  }

  /**
   * Comprueba si el usuario tiene permiso de escritura para la ruta activa
   */
  canUpdateCurrentRoute(currentUrl: string): boolean {
    if (!this.isLoggedIn()) return true; // Fallback para desarrollo sin login

    let matchedModuleId: number | null = null;
    
    // Buscar la ruta en la lista estática de menús
    for (const section of SIDEBAR_MENU) {
      for (const item of section.items) {
        if (item.subItems) {
          const found = item.subItems.find((sub: any) => currentUrl.startsWith(sub.path));
          if (found) {
            matchedModuleId = found.module_id;
            break;
          }
        }
      }
      if (matchedModuleId !== null) break;
    }

    if (matchedModuleId === null) return true; // Si no está mapeado, permitir todo por defecto

    const perms = this.permissions();
    if (perms.length === 0) return true; // Fallback si aún no cargan los permisos

    const p = perms.find(x => x.module_id === matchedModuleId);
    return p ? p.can_update : false;
  }
}
