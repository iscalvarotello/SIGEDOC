import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GridShapeComponent } from '../../../shared/components/common/grid-shape/grid-shape.component';
import { ThemeToggleTwoComponent } from '../../../shared/components/common/theme-toggle-two/theme-toggle-two.component';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GridShapeComponent,
    ThemeToggleTwoComponent
  ],
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent {
  private router = inject(Router);

  retry() {
    this.router.navigate(['/signin']);
  }
}
