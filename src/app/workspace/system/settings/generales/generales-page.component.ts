import { Component, signal, inject } from '@angular/core';
import { CommonModule                       } from '@angular/common';
import { ButtonTabComponent                 } from '@system-shared/buttons/button-tab/button-tab.component';
import { SideNavCardComponent               } from '@system-shared/layout/side-nav-card/side-nav-card.component';
import { ContentNavCardComponent            } from '@system-shared/layout/content-nav-card/content-nav-card.component';
import { TitleComponent                     } from '@system-shared/ui/title/title.component';

import { GeneralesInstitucionTabComponent   } from './components/generales-institucion-tab/generales-institucion-tab.component';
import { GeneralesDocumentosTabComponent    } from './components/generales-documentos-tab/generales-documentos-tab.component';
import { GeneralesMinutariosTabComponent    } from './components/generales-minutarios-tab/generales-minutarios-tab.component';
import { GeneralesSmtpTabComponent          } from './components/generales-smtp-tab/generales-smtp-tab.component';
import { GeneralesMantenimientoTabComponent } from './components/generales-mantenimiento-tab/generales-mantenimiento-tab.component';
import { GeneralesSeguridadTabComponent     } from './components/generales-seguridad-tab/generales-seguridad-tab.component';

@Component({
  selector: 'app-generales-page',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonTabComponent, 
    SideNavCardComponent,
    ContentNavCardComponent,
    GeneralesInstitucionTabComponent,
    GeneralesDocumentosTabComponent,
    GeneralesMinutariosTabComponent,
    GeneralesSmtpTabComponent,
    GeneralesMantenimientoTabComponent,
    GeneralesSeguridadTabComponent,
    TitleComponent
  ],
  templateUrl: './generales-page.component.html'
})
export class GeneralesPageComponent {
  // Tab activa del Panel
  activeTab = signal<'institucion' | 'documentos' | 'minutarios' | 'smtp' | 'mantenimiento' | 'seguridad'>('institucion');

  setTab(tab: 'institucion' | 'documentos' | 'minutarios' | 'smtp' | 'mantenimiento' | 'seguridad') {
    this.activeTab.set(tab);
  }
}
