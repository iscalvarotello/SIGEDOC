import { Injectable, computed, signal } from '@angular/core';
import { LIST_DOCUMENTS   } from './data'; // Importa tus datos ficticios
import { DocumentItemList } from '../interfaces/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _documents = signal<DocumentItemList[]>(LIST_DOCUMENTS);

  constructor() {}

  /**
   * Obtiene la lista filtrada de documentos
   * @param tipoDocumento - 1: Memo, 2: Oficio, etc. (0 para todos)
   * @param idArea - El ID de la secretaría o área (0 para todos)
   */
  public getDocumentList(tipoDocumento: number, idArea: number): DocumentItemList[] {
    
    let filteredList = this._documents();

    if (tipoDocumento > 0) {
      filteredList = filteredList.filter(doc => doc.tipo_documento === tipoDocumento);
    }

    if (idArea > 0) {
      // Nota: Aquí filtramos por id_destinatario o id_solicitante según tu necesidad
      // Por ahora filtramos por el id_destinatario que definimos como string
      filteredList = filteredList.filter(doc => doc.id_area_base === idArea);
    }

    return filteredList;
  }

  // Bonus: Un método para agregar nuevos documentos (para cuando hagas el formulario)
  public addDocument(newDoc: DocumentItemList) {
    this._documents.update(docs => [...docs, newDoc]);
  }
}
