import { Pipe, type PipeTransform } from '@angular/core';
import { TipoDocumentoId, ClaseDocumentoId } from '../interfaces/document.interface';
import { TIPODOCUMENTO_MAP } from './document-maps';

@Pipe({
  name: 'tipoDocument',
})
export class TipodocumentPipe implements PipeTransform {

  transform(tipoId: TipoDocumentoId, claseId: ClaseDocumentoId | string, format: 'singular' | 'plural' = 'singular'): string {
    const idClase = Number(claseId);
    const info = TIPODOCUMENTO_MAP[tipoId];
    if (!info) return '';

    // Lógica de género: 1 y 2 son masculinos, 3 y 4 son femeninos
    const esMasculino = idClase < 3;

    if (format === 'plural') {
      return esMasculino ? info.plural_masculino : info.plural_femenino;
    }
    return esMasculino ? info.singular_masculino : info.singular_femenino;
  }
}