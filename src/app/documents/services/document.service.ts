import { Injectable } from '@angular/core';
import { signal     } from '@angular/core';

import { LIST_DOCUMENTS   } from './data'; // Importa tus datos ficticios
import { DocumentItem     } from '../interfaces/document.interface';

import type { ClaseDocumentoId } from '../interfaces/document.interface'; 
import type { TipoDocumento    } from '../interfaces/document.interface'; 

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _documents = signal<DocumentItem[]>(LIST_DOCUMENTS);

  constructor() {}

  /**
   * Obtiene la lista filtrada de documentos
   * @param claseDocumento: 1 - Memo, 2 - Oficio
   * @param tipoDocumento - 'directo' | 'gestionado'
   * @param idArea - El ID de la secretaría o área (0 para todos)
   */
  public getDocumentList(claseDocumento: ClaseDocumentoId, tipoDocumento: TipoDocumento): DocumentItem[] {
    
    let filteredList = this._documents();

    if (claseDocumento > 0) {
      filteredList = filteredList.filter(doc => doc.clase_documento === claseDocumento);
    }


    return filteredList;
  }

  // Bonus: Un método para agregar nuevos documentos (para cuando hagas el formulario)
  public addDocument ( newDoc: DocumentItem ) {
    this._documents.update(docs => [ ...docs , newDoc ] );
  }
  
}
