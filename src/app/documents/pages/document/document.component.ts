import { Component        } from '@angular/core' ;
import { computed         } from '@angular/core' ;
import { input            } from '@angular/core' ;
import { signal           } from '@angular/core' ;

import { CommonModule     } from '@angular/common';

import { ClaseDocumento   } from './../../interfaces/document.interface'  ;
import { ClaseDocumentoId } from '../../interfaces/document.interface'    ;
import { TipoDocumento    } from '../../interfaces/document.interface'    ;

import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DocumentTableComponent  } from "../../componentes/document-table/document-table.component";
import { DocumentDetailComponent } from "../../componentes/document-detail/document-detail.component";


@Component({
  selector: 'app-document',
  standalone: true, // Asegúrate de que sea standalone si no usas módulos
  imports: [PageBreadcrumbComponent, CommonModule, DocumentTableComponent, DocumentDetailComponent],
  templateUrl: './document.component.html',
})
export class DocumentComponent { 
  claseDocumentoId     = input.required<ClaseDocumentoId>( ) ;
  tipoDocumento        = signal<TipoDocumento>( 'directo' )  ;

  private readonly DOCUMENTO_MAP: Record<ClaseDocumentoId,ClaseDocumento> = {
    1: { id: 1, label: 'Memorándum'          , plural: "Memorándums"           , slug: 'memo'     , icon: 'description' } ,
    2: { id: 2, label: 'Oficio'              , plural: "Oficios"               , slug: 'oficio'   , icon: 'mail'        } ,
    3: { id: 3, label: 'Tarjeta Informativa' , plural: "Tarjetas Informativas ", slug: 'T.I'      , icon: 'assignment'  } ,
    4: { id: 4, label: 'Circular'            , plural: "Circulares"            , slug: 'circular' , icon: 'campaign'    } ,
  };

  // Signal computada: Se actualiza sola si el tipoId cambia
  documentInfo = computed(() => {
    const id = Number( this.claseDocumentoId( ) ) ;
    return this.DOCUMENTO_MAP[id as keyof typeof this.DOCUMENTO_MAP];
  });

  tituloClaseDocumento = computed(() => this.documentInfo().plural ?? 'Documento');

  // Lógica de colores dinámica para el switch (Guinda vs Dorado)
  claseActiva = 'bg-[#691C32] text-white shadow-md';
  claseInactiva = 'text-gray-500 hover:text-[#691C32] bg-gray-100';

  setTipoDocumento(tipo: TipoDocumento) {
    this.tipoDocumento.set ( tipo ) ;
  }
}
