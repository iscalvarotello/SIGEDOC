import { Pipe, type PipeTransform } from '@angular/core';
import { ClaseDocumentoId } from '../interfaces/document.interface';
import { DOCUMENTO_MAP } from './document-maps';


@Pipe({
  name: 'claseDocument',
})
export class ClaseDocumentPipe implements PipeTransform {

  transform(id: ClaseDocumentoId, format: 'singular' | 'plural' | 'conector_d' | 'conector_a' = 'singular', isButton: boolean = false): string {
    const info = DOCUMENTO_MAP[id];
    if (!info) return '';

    let conector = '';
    if (format === 'conector_d') conector = info.conector_d + ' ' ;
    if (format === 'conector_a') conector = info.conector_a + ' ' ;

    if (isButton) return info.label_boton_new; // Devuelve 'Nuevo' o 'Nueva'
    return format === 'plural' ? info.plural : conector + info.label;
  }
}