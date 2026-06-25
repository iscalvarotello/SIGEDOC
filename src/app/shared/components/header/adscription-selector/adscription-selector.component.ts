import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionService } from '../../../services/sesion.service';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';

@Component({
  selector: 'app-adscription-selector',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './adscription-selector.component.html'
})
export class AdscriptionSelectorComponent {
  public sesionService = inject(SesionService);
  
  isOpen = false;

  // Reactividad directa
  dataUser = computed(() => this.sesionService.dataUser);
  adscriptions = computed(() => this.sesionService.adscriptions());
  activeAds = computed(() => this.sesionService.activeAdscription());

  // Acrónimo activo
  activeAcronym = computed(() => {
    const ads = this.activeAds();
    if (!ads) return 'S/A';
    return ads.acronym_area || ads.acronym_area_base || 'S/A';
  });

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  isActive(ads: any): boolean {
    const current = this.activeAds();
    return current && current.id_area === ads.id_area;
  }

  switchAdscription(ads: any) {
    this.sesionService.setActiveAdscription(ads);
    this.closeDropdown();
    
    // Recargar la página actual para forzar la actualización de bandejas de documentos/firmas
    window.location.reload();
  }
}
