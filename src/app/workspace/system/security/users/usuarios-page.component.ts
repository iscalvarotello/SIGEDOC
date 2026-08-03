import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageController } from '@baseclass/base-page.controller';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { USUARIOS_PAGE_CONFIG } from './usuarios-page.config';
import { MasterWrapperComponent } from '@system-shared/master-detail/master-wrapper.component';
import { DataTableComponent } from '@system-shared/master-detail/data-table.component';
import { DetailViewerComponent } from '@system-shared/master-detail/detail-viewer.component';
import { DismissAreacardComponent } from '@workspace-shared/components/common/dismiss-areacard/dismiss-areacard.component';
import { ActionBarAction, ActionBarComponent } from '@system-shared/common/action-bar/action-bar.component';
import { getActionsConfig } from './users.setting';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [
    CommonModule,
    MasterWrapperComponent,
    DataTableComponent,
    DetailViewerComponent,
    DismissAreacardComponent,
    ActionBarComponent
  ],
  templateUrl: './usuarios-page.component.html'
})
export class UsuariosPageComponent extends BasePageController<UserDTO> {
  protected override apiService = inject(UserService);
  public override pageConfig = USUARIOS_PAGE_CONFIG;

  isSuperAdmin = computed(() => this.sesionService.currentUserData()?.backend_role === 'superadmin');
  isAdmin = computed(() => {
    const role = this.sesionService.currentUserData()?.backend_role;
    return role === 'admin' || role === 'superadmin';
  });

   actionsConfig = computed<ActionBarAction[]>(() => {
      return getActionsConfig(this.selectedItem());
  });

  handleAction(action: ActionBarAction) {
    const user = this.selectedItem();
    if (!user) return;

    if (action.id === 'toggle_active') {
      this.toggleUserActive(user);
    } else if (action.id === 'reset_password') {
      this.resetUserPassword(user);
    } else if (action.id === 'make_superadmin') {
      this.makeUserSuperAdmin(user);
    }
  }

  async toggleUserActive(user: UserDTO) {
    const actionWord = user.active ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${actionWord} al usuario ${user.email}?`)) {
      try {
        this.isLoading.set(true);
        await this.apiService.update(user.id, { active: !user.active });
        alert(`Usuario ${user.email} se ha ${actionWord === 'desactivar' ? 'desactivado' : 'activado'} correctamente.`);
        
        // Actualizar item seleccionado en el estado local
        const updatedUser = { ...user, active: !user.active } as any;
        this.selectedItem.set(updatedUser);
        
        await this.refresh();
      } catch (error: any) {
        console.error('Error toggling user active:', error);
        alert('Hubo un error al intentar cambiar el estado del usuario:\n' + (error?.error?.message || error?.message));
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async resetUserPassword(user: UserDTO) {
    if (confirm(`¿Estás seguro de resetear la contraseña del usuario ${user.email} al valor por defecto?`)) {
      try {
        this.isLoading.set(true);
        await this.apiService.resetPassword(user.id);
        alert(`La contraseña del usuario ${user.email} ha sido reseteada correctamente.`);
        await this.refresh();
      } catch (error: any) {
        console.error('Error resetting password:', error);
        alert('Hubo un error al intentar resetear la contraseña:\n' + (error?.error?.message || error?.message));
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async makeUserSuperAdmin(user: UserDTO) {
    if (confirm(`🚨 ADVERTENCIA: ¿Estás seguro de que deseas convertir al usuario ${user.email} en SUPERADMINISTRADOR?\nEsta es una acción con los máximos privilegios del sistema.`)) {
      try {
        this.isLoading.set(true);
        await this.apiService.update(user.id, { backend_role: 'superadmin' });
        alert(`El usuario ${user.email} ahora tiene el rol de Superadministrador.`);
        
        // Actualizar item seleccionado en el estado local
        const updatedUser = { ...user, backend_role: 'superadmin' } as any;
        this.selectedItem.set(updatedUser);
        
        await this.refresh();
      } catch (error: any) {
        console.error('Error setting superadmin:', error);
        alert('Hubo un error al intentar asignar el rol de Superadministrador:\n' + (error?.error?.message || error?.message));
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
