import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMetaCardComponent } from '../user-meta-card/user-meta-card.component';
import { UserPersonalInfoCardComponent } from '../user-personal-info-card/user-personal-info-card.component';
import { UserInfoCardComponent } from '../user-info-card/user-info-card.component';

@Component({
  selector: 'app-user-employee-tab',
  standalone: true,
  imports: [
    CommonModule,
    UserMetaCardComponent,
    UserPersonalInfoCardComponent,
    UserInfoCardComponent
  ],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <app-user-meta-card />
      <app-user-personal-info-card />
      <app-user-info-card />
    </div>
  `
})
export class UserEmployeeTabComponent {}
