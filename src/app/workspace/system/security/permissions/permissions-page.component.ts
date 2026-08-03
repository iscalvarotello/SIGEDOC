import { Component, OnInit, inject, signal } from '@angular/core';
import { ActionButtonComponent } from '@metasystem/components/buttons/action-button/action-button.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '@security/roles/role.service';
import { RoleDTO } from '@security/roles/role.dto';
import { PermissionService } from './permission.service';
import { PermissionDTO } from './permission.dto';
import { SIDEBAR_MENU, MenuSection, NavItem } from '@core/menu/app.sidebar.menu';
import { SafeHtmlPipe } from '@system-pipe/safe-html.pipe';

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe, IconComponent, ActionButtonComponent],
  templateUrl: './permissions-page.component.html'
})
export class PermissionsPageComponent implements OnInit {
  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);

  // Catálogos
  roles = signal<RoleDTO[]>([]);
  menuSections: MenuSection[] = SIDEBAR_MENU;

  // Estados de selección
  selectedRoleId = signal<number | null>(null);
  activeTabPrefix = signal<string>('operativity');
  openAccordions = signal<Set<string>>(new Set<string>());

  // Mapa de Permisos: module_id -> PermissionDTO
  permissionsMap = signal<Map<number, PermissionDTO>>(new Map());

  // Estado de carga y guardado reactivo
  isLoadingRoles = signal<boolean>(false);
  isLoadingPermissions = signal<boolean>(false);
  savingStatuses = signal<Record<number, 'saving' | 'saved' | 'error' | null>>({});

  ngOnInit() {
    this.loadRoles();
    
    // Abrir el primer acordeón por defecto en cada sección
    if (this.menuSections.length > 0 && this.menuSections[0].items.length > 0) {
      this.openAccordions.set(new Set([this.menuSections[0].items[0].name]));
    }
  }

  async loadRoles() {
    this.isLoadingRoles.set(true);
    try {
      const response = await this.roleService.getAll();
      this.roles.set(response.data || []);
      
      // Auto-seleccionar primer rol si está disponible
      if (response.data && response.data.length > 0) {
        this.selectRole(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    } finally {
      this.isLoadingRoles.set(false);
    }
  }

  async selectRole(roleId: number) {
    this.selectedRoleId.set(roleId);
    this.isLoadingPermissions.set(true);
    this.permissionsMap.set(new Map()); // Reset temporal
    this.savingStatuses.set({});

    try {
      const perms = await this.permissionService.getPermissionsByRole(roleId);
      const newMap = new Map<number, PermissionDTO>();
      perms.forEach(p => {
        newMap.set(p.module_id, p);
      });
      this.permissionsMap.set(newMap);
    } catch (error) {
      console.error('Error al cargar permisos del rol:', error);
    } finally {
      this.isLoadingPermissions.set(false);
    }
  }

  onRoleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.selectRole(Number(value));
    } else {
      this.selectedRoleId.set(null);
      this.permissionsMap.set(new Map());
    }
  }

  setTab(prefix: string) {
    this.activeTabPrefix.set(prefix);
    
    // Abrir automáticamente el primer acordeón de la sección activa
    const section = this.menuSections.find(s => s.prefix === prefix);
    if (section && section.items.length > 0) {
      this.openAccordions.set(new Set([section.items[0].name]));
    }
  }

  toggleAccordion(accordionName: string) {
    const set = new Set(this.openAccordions());
    if (set.has(accordionName)) {
      set.delete(accordionName);
    } else {
      set.add(accordionName);
    }
    this.openAccordions.set(set);
  }

  isAccordionOpen(accordionName: string): boolean {
    return this.openAccordions().has(accordionName);
  }

  getPermission(moduleId: number): { can_read: boolean; can_update: boolean } {
    const perm = this.permissionsMap().get(moduleId);
    return {
      can_read: perm ? perm.can_read : false,
      can_update: perm ? perm.can_update : false
    };
  }

  async togglePermission(moduleId: number, field: 'can_read' | 'can_update', currentValue: boolean) {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    const newValue = !currentValue;
    const currentPerm = this.getPermission(moduleId);
    
    // Optimistic UI state updates
    const updatedPerm = {
      ...currentPerm,
      [field]: newValue
    };

    // Actualizar mapa local inmediatamente
    const mapCopy = new Map(this.permissionsMap());
    const existing = mapCopy.get(moduleId);
    if (existing) {
      existing[field] = newValue;
      mapCopy.set(moduleId, existing);
    } else {
      const newPerm = new PermissionDTO({
        role_id: roleId,
        module_id: moduleId,
        [field]: newValue
      });
      mapCopy.set(moduleId, newPerm);
    }
    this.permissionsMap.set(mapCopy);

    // Colocar estado de guardando
    this.updateSavingStatus(moduleId, 'saving');

    try {
      const payload = {
        role_id: roleId,
        module_id: moduleId,
        can_read: updatedPerm.can_read,
        can_update: updatedPerm.can_update
      };
      
      const saved = await this.permissionService.upsertPermission(payload);
      
      // Actualizar el mapa local con el registro devuelto por el backend (incluyendo el ID de BD)
      const freshMap = new Map(this.permissionsMap());
      freshMap.set(moduleId, saved);
      this.permissionsMap.set(freshMap);
      
      this.updateSavingStatus(moduleId, 'saved');
      
      // Limpiar estado de guardado tras 2 segundos
      setTimeout(() => {
        if (this.savingStatuses()[moduleId] === 'saved') {
          this.updateSavingStatus(moduleId, null);
        }
      }, 2000);
    } catch (error) {
      console.error('Error al guardar permiso:', error);
      this.updateSavingStatus(moduleId, 'error');

      // Revertir cambio local
      const revertMap = new Map(this.permissionsMap());
      const orig = revertMap.get(moduleId);
      if (orig) {
        orig[field] = currentValue;
        revertMap.set(moduleId, orig);
      }
      this.permissionsMap.set(revertMap);

      // Limpiar estado de error tras 3 segundos
      setTimeout(() => {
        if (this.savingStatuses()[moduleId] === 'error') {
          this.updateSavingStatus(moduleId, null);
        }
      }, 3000);
    }
  }

  private updateSavingStatus(moduleId: number, status: 'saving' | 'saved' | 'error' | null) {
    this.savingStatuses.update(prev => ({
      ...prev,
      [moduleId]: status
    }));
  }
}
