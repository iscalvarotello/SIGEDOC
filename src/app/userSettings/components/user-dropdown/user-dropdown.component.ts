import { Component, inject } from '@angular/core';
import { DropdownComponent } from '@components/ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '@components/ui/dropdown/dropdown-item/dropdown-item.component-two';
import { SesionService } from '@shared/services/sesion.service';
import { SafeHtmlPipe } from '@shared/pipe/safe-html.pipe';
import { SVG_ICONS } from '@shared/icons/svg-icons';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent, SafeHtmlPipe]
})
export class UserDropdownComponent {
  isOpen = false;

  currentUser = inject(SesionService);
  private router = inject(Router);

  getIconSvg(name: string): string {
    return (SVG_ICONS as any)[name] || '';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.currentUser.clearSession();
    this.closeDropdown();
    this.router.navigate(['/signin']);
  }
}
