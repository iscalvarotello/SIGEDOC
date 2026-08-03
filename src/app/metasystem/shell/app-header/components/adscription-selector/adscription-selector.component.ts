import { ButtonDropDownComponent } from '@system-shared/buttons/button-drop-down/button-drop-down.component';
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionService } from '@services/sesion.service';
import { DropdownComponent } from '@system-shared/ui/dropdown/dropdown.component';
import { ButtonBandejaComponent } from '@system-shared/buttons/button-bandeja/button-bandeja.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';

@Component({
  selector: 'app-adscription-selector',
  standalone: true,
  imports: [CommonModule, DropdownComponent, ButtonBandejaComponent, ButtonDropDownComponent, TitleComponent],
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
