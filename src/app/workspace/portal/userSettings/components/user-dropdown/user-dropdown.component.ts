import { Component, inject } from '@angular/core';
import { DropdownComponent } from '@system-shared/ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule     } from '@angular/router';
import { DropdownItemTwoComponent } from '@system-shared/ui/dropdown/dropdown-item/dropdown-item.component-two';
import { DropdownMenuComponent    } from '@system-shared/ui/dropdown/dropdown-menu.component';
import { SesionService            } from '@services/sesion.service';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { TitleComponent } from '@system-shared/ui/title/title.component';
import { AvatarButtonComponent } from '@system-shared/buttons/avatar-button/avatar-button.component';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent, DropdownMenuComponent, ActionButtonComponent, TitleComponent, AvatarButtonComponent]
})
export class UserDropdownComponent {
  isOpen = false;

  currentUser = inject(SesionService);
  private router = inject(Router);

  toggleDropdown() { this.isOpen = !this.isOpen; }

  closeDropdown() {  this.isOpen = false; }

  logout() {
    this.currentUser.clearSession();
    this.closeDropdown();
    this.router.navigate(['/signin']);
  }
}

