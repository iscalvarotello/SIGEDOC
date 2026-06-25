import { Component, input } from '@angular/core';
import { ClaseDocumentoId, TipoDocumento, ClaseDocumento } from '../../interfaces/document.interface';

@Component({
  selector: 'document-table',
  imports: [],
  templateUrl: './document-table.component.html',
})
export class DocumentTableComponent { 
  tipoDocumento  = input.required<TipoDocumento>();
  ClaseDocumento = input.required<ClaseDocumentoId>() ;
}
