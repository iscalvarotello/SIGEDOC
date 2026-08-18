import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentLocalRendererService {
  /**
   * Reemplaza variables en memoria (cuerpo HTML) sin tener que recurrir al backend.
   * Especialmente util para previsualizar Anexos, CCPs y Codigo QR temporal en la vista de Edicion.
   * 
   * @param html El texto HTML base (con {{tags}} sin reemplazar)
   * @param data Datos en memoria de la sesion actual del documento
   */
  public renderLocalHtml(html: string, data: {
    attachments?: any[],
    ccps?: any[],
    showQrMock?: boolean
  }): string {
    if (!html) return '';
    let rendered = html;

    // 1. Reemplazar {{__attachmen_list__}} y {{__attachmen__}}
    if (rendered.includes('{{__attachmen_list__}}') || rendered.includes('{{__attachmen__}}')) {
      if (data.attachments && data.attachments.length > 0) {
        rendered = rendered.split('{{__attachmen__}}').join('Anexos');
        const listLines = data.attachments.map(att => `* ${att.attachment_title}`);
        rendered = rendered.split('{{__attachmen_list__}}').join(listLines.join('<br>'));
      } else {
        rendered = rendered.split('{{__attachmen__}}').join('');
        rendered = rendered.split('{{__attachmen_list__}}').join('');
      }
    }

    // 2. Reemplazar {{CCP}}
    if (rendered.includes('{{CCP}}')) {
      if (data.ccps && data.ccps.length > 0) {
        const ccpLines = data.ccps.map(ccp => {
          // Extraer nombre y puesto de los metadatos o fallback
          const name = ccp.metadatos?.employee_name || ccp.empleado?.person?.name || 'Empleado';
          const prefix = ccp.metadatos?.employee_prefix ? `${ccp.metadatos.employee_prefix} ` : '';
          const firstSurname = ccp.metadatos?.employee_first_surname || ccp.empleado?.person?.first_surname || '';
          const secondSurname = ccp.metadatos?.employee_second_surname || ccp.empleado?.person?.second_surname || '';
          const fullName = `${prefix}${name} ${firstSurname} ${secondSurname}`.trim();
          
          const puesto = ccp.metadatos?.job_position || ccp.empleado?.adscriptions?.[0]?.job_position?.name || 'Puesto';
          const motivo = ccp.motivo ? `.- ${ccp.motivo}` : '';
          
          return `C.c.p. ${fullName}, ${puesto}${motivo}`;
        });
        rendered = rendered.split('{{CCP}}').join(ccpLines.join('<br>'));
      } else {
        rendered = rendered.split('{{CCP}}').join('');
      }
    }

    // 3. Simular Codigo QR
    if (rendered.includes('{{__QR__}}')) {
      if (data.showQrMock) {
        // Un placeholder QR en base64 o una imagen estatica
        const mockQrUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50" y="50" font-family="Arial" font-size="12" text-anchor="middle" alignment-baseline="middle" fill="%23999">QR PREVIEW</text></svg>';
        const imgTag = `<img src="${mockQrUrl}" width="100" height="100" style="width: 100px; height: 100px; object-fit: contain;" alt="QR Preview" />`;
        rendered = rendered.split('{{__QR__}}').join(imgTag);
      } else {
        rendered = rendered.split('{{__QR__}}').join('');
      }
    }

    // 4. Limpiar etiquetas huerfanas que no se reemplazan en frontend
    const tagsToClean = ['{{__SIGNATURE__}}', '{{__signature__}}', '{{__break_page__}}'];
    tagsToClean.forEach(tag => {
      rendered = rendered.split(tag).join('');
    });

    return rendered;
  }
}
