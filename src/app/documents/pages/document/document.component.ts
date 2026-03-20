import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoDocumentoId, TipoDocumento, OrigenDocumento } from './tipo-doc.interface';


import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';


@Component({
  selector: 'app-document',
  standalone: true, // Asegúrate de que sea standalone si no usas módulos
  imports: [PageBreadcrumbComponent, CommonModule],
  templateUrl: './document.component.html',
})
export class DocumentComponent { 
  tipoId = input.required<TipoDocumentoId>( );
  origenSeleccionado = signal<OrigenDocumento>('directo');

  private readonly DOCUMENTO_MAP: Record<TipoDocumentoId, TipoDocumento> = {
    1: { id: 1, label: 'Memorándum', slug: 'memo', icon: 'description' },
    2: { id: 2, label: 'Oficio', slug: 'oficio', icon: 'mail' },
    3: { id: 3, label: 'Tarjeta Informativa', slug: 'T.I', icon: 'assignment' },
    4: { id: 4, label: 'Circular', slug: 'circular', icon: 'campaign' },
  };

  // Signal computada: Se actualiza sola si el tipoId cambia
  documentInfo = computed(() => {
    const id = Number(this.tipoId());
    return this.DOCUMENTO_MAP[id as keyof typeof this.DOCUMENTO_MAP];
  });

  tituloDocumento = computed(() => this.documentInfo().label ?? 'Documento');

  // Lógica de colores dinámica para el switch (Guinda vs Dorado)
  claseActiva = 'bg-[#691C32] text-white shadow-md';
  claseInactiva = 'text-gray-500 hover:text-[#691C32] bg-gray-100';

  setOrigen(origen: OrigenDocumento) {
    this.origenSeleccionado.set(origen);
  }


}
