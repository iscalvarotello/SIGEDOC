import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '@system-shared/common/page-breadcrumb/page-breadcrumb.component';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-manuals-page',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent, IconComponent],
  templateUrl: './manuals-page.component.html'
})
export class ManualsPageComponent {

  manuals = [
    { title: 'Manual de Usuario', description: 'Aprenda a utilizar el sistema de forma eficiente.', link: '#' },
    { title: 'Manual del Administrador', description: 'Configuraciones del sistema y control de acceso.', link: '#' },
    { title: 'Guía de Plantillas', description: 'Cómo construir y modificar plantillas de documentos.', link: '#' }
  ];

}
