import { Component, inject, computed } from '@angular/core';
import { SesionService } from '@services/sesion.service';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from '@system-shared/ui/globe/globe.component';

@Component({
  selector: 'app-user-info-card',
  standalone: true,
  imports: [CommonModule, GlobeComponent],
  templateUrl: './user-info-card.component.html'
})
export class UserInfoCardComponent {
  public sesionService = inject(SesionService);

  // Reactividad directa
  activeAds = computed(() => this.sesionService.activeAdscription());
  adscriptions = computed(() => this.sesionService.adscriptions());
  userData = computed(() => this.sesionService.currentUserData());

  // Resolver puesto funcional con sensibilidad de género
  getResolvedJobPosition(ads: any): string {
    if (!ads) return 'Colaborador Estándar';
    const user = this.userData();
    const sex = user?.datos_personales?.sex || '';
    if (ads.job_position) {
      return (sex === 'F' && ads.job_position.name_fem) 
        ? ads.job_position.name_fem 
        : (ads.job_position.name || 'Puesto no asignado');
    }
    return ads.area_type_name || 'Personal Operativo';
  }

  // Lista de adscripciones secundarias
  secondaryAdscriptions = computed(() => {
    const list = this.adscriptions();
    const active = this.activeAds();
    if (!active) return [];
    return list.filter((a: any) => a.id_area !== active.id_area);
  });
}
