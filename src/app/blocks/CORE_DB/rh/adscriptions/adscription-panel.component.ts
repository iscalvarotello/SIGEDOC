import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdscriptionService } from './adscription.service';
import { AdscriptionDTO } from './adscription.dto';
import { GenericApiService } from '@app/core/services/generic-api.service';
import { ENDPOINT_KEYS } from '@app/core/api/api-routes.config';
import { AdscriptionFormComponent } from './adscription-form.component';
import { ActionBarComponent, ActionBarAction } from '../../../../shared/components/common/action-bar/action-bar.component';
import { AreaHeaderComponent } from '../../../../shared/components/common/area-header/area-header.component';
import { EmployeeCardComponent } from '../../../../shared/components/common/employee-card/employee-card.component';
import { CardListComponent } from '../../../../shared/components/common/card-list/card-list.component';
import { DismissAreacardComponent } from '../../../../shared/components/common/dismiss-areacard/dismiss-areacard.component';
import { getAdscriptionsActionsConfig } from './adscriptions.settings';

@Component({
  selector: 'app-adscription-panel',
  standalone: true,
  imports: [
    CommonModule,
    AdscriptionFormComponent,
    ActionBarComponent,
    AreaHeaderComponent,
    EmployeeCardComponent,
    CardListComponent,
    DismissAreacardComponent
  ],
  templateUrl: './adscription-panel.component.html'
})
export class AdscriptionPanelComponent {
  selectedArea = input<any | null>(null);

  private adscriptionService = inject(AdscriptionService);
  private genericService = inject(GenericApiService);

  // Estados de la lista de adscripciones
  adscriptionsList = signal<AdscriptionDTO[]>([]);
  isAdscriptionsLoading = signal<boolean>(false);

  // Estados del Drawer/Slide-over
  isDrawerOpen = signal<boolean>(false);
  activeAction = signal<string>('adscribir');
  editingAdscription = signal<AdscriptionDTO | null>(null);

  // Habilitadores de Acciones Contextuales
  canChangeTitular = computed(() => {
    return this.titularAdscription() !== null;
  });

  canRestoreTitular = computed(() => {
    return this.encargadoAdscription() !== null;
  });

  // Selectores Computados (Roles Liderazgo vs Operativo)
  titularAdscription = computed(() => {
    return this.adscriptionsList().find(adsc => adsc.is_head && !adsc.is_in_charge && adsc.active) || null;
  });

  encargadoAdscription = computed(() => {
    return this.adscriptionsList().find(adsc => adsc.is_in_charge && adsc.active) || null;
  });

  operativeAdscriptions = computed(() => {
    return this.adscriptionsList().filter(adsc => !adsc.is_head && !adsc.is_in_charge);
  });

  // Configuración de la barra de acciones dinámicas
  actionsConfig = computed<ActionBarAction[]>(() => {
    return getAdscriptionsActionsConfig(this.canChangeTitular(), this.canRestoreTitular());
  });

  constructor() {
    effect(() => {
      const area = this.selectedArea();
      if (area && area.id) {
        this.loadAdscriptions(area.id);
      } else {
        this.adscriptionsList.set([]);
      }
    });
  }

  async loadAdscriptions(idArea: string) {
    this.isAdscriptionsLoading.set(true);
    try {
      const res = await this.adscriptionService.getByArea(idArea, true);
      this.adscriptionsList.set(res.data || []);
    } catch (e) {
      console.error('Error cargando adscripciones:', e);
      this.adscriptionsList.set([]);
    } finally {
      this.isAdscriptionsLoading.set(false);
    }
  }

  // --- COMPORTAMIENTO ADAPTATIVO DEL DRAWER ---

  openActionDrawer(action: string) {
    this.activeAction.set(action);
    this.editingAdscription.set(null);
    this.isDrawerOpen.set(true);
  }

  openEditAdscriptionDrawer(adsc: AdscriptionDTO) {
    this.activeAction.set('editar');
    this.editingAdscription.set(adsc);
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.editingAdscription.set(null);
  }

  onFormSaved() {
    const area = this.selectedArea();
    if (area) {
      this.loadAdscriptions(area.id);
    }
    this.closeDrawer();
  }

  handleActionBarClick(action: ActionBarAction) {
    if (action.id === 'restablecer') {
      this.confirmRestoreTitular();
    } else {
      this.openActionDrawer(action.id);
    }
  }

  async confirmRestoreTitular() {
    const area = this.selectedArea();
    if (!area || !this.encargadoAdscription()) return;

    const encargadoName = this.encargadoAdscription()!.fullName;

    if (confirm(`⚠️ ¿Estás seguro de restablecer el titular en esta área?\nSe dará de baja la adscripción temporal de: ${encargadoName}.`)) {
      try {
        await this.adscriptionService.restoreTitular(area.id);
        await this.loadAdscriptions(area.id);

        this.genericService.clearCache(`${ENDPOINT_KEYS.ADSCRIPTIONS}_by_area_${area.id}`);
        this.genericService.clearCache(ENDPOINT_KEYS.EMPLOYEES);
      } catch (e: any) {
        console.error('Error al restablecer titular:', e);
        alert('No se pudo revocar la adscripción temporal:\n' + (e?.error?.message || e?.message));
      }
    }
  }

  async deleteAdscription(adsc: AdscriptionDTO) {
    const area = this.selectedArea();
    if (!area) return;

    if (confirm(`⚠️ ¿Estás seguro de dar de baja la adscripción de ${adsc.fullName}?\nSe marcará como inactiva estableciendo su fecha de término al día de hoy.`)) {
      try {
        await this.adscriptionService.dismiss(adsc.id);
        await this.loadAdscriptions(area.id);

        this.genericService.clearCache(`${ENDPOINT_KEYS.ADSCRIPTIONS}_by_area_${area.id}`);
        this.genericService.clearCache(ENDPOINT_KEYS.EMPLOYEES);
      } catch (e: any) {
        console.error('Error al dar de baja adscripción:', e);
        alert('No se pudo procesar la baja:\n' + (e?.error?.message || e?.message));
      }
    }
  }
}
