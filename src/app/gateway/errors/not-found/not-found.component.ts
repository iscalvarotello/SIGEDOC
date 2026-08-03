import { Component } from '@angular/core';
import { GridShapeComponent } from '@system-shared/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';
import { SmartImageComponent } from '@system-shared/images/index';

@Component({
  selector: 'app-not-found',
  imports: [
    GridShapeComponent,
    RouterModule, SmartImageComponent],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {

  currentYear: number = new Date().getFullYear();
}
