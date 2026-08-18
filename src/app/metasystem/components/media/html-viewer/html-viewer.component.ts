import { Component, input, output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-html-viewer',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './html-viewer.component.html'
})
export class HtmlViewerComponent {
  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  htmlUrl = input<SafeResourceUrl | null>(null);
  isLoading = input<boolean>(false);
  showCloseButton = input<boolean>(true);
  isAuthorized = input<boolean>(false);

  // Outputs
  closeClick = output<void>();
  onSignDigital = output<void>();
  onSignAutograph = output<void>();

  @ViewChild('htmlIframe', { static: false }) htmlIframe!: ElementRef<HTMLIFrameElement>;

  printDocument() {
    if (this.htmlIframe && this.htmlIframe.nativeElement.contentWindow) {
      try {
        this.htmlIframe.nativeElement.contentWindow.print();
      } catch (e) {
        console.error('No se pudo invocar la impresion del iframe', e);
      }
    }
  }

  // Metodo para limpiar las etiquetas para impresion autografa
  cleanHtmlForPrinting() {
    if (!this.htmlIframe || !this.htmlIframe.nativeElement.contentDocument) {
      console.error('El Iframe no esta cargado.');
      return;
    }
    const doc = this.htmlIframe.nativeElement.contentDocument;
    const htmlString = doc.body.innerHTML;
    let modifiedHtml = htmlString
      .replace(/{{__signature__}}/gi, '')
      .replace(/{{__attachmen_list__}}/gi, '')
      .replace(/{{__attachmen__}}/gi, '')
      .replace(/{{CCP}}/gi, '')
      .replace(/{{MAKER}}/gi, '');
      
    doc.body.innerHTML = modifiedHtml;
  }

  // Metodo para extraer el HTML, reemplazar la leyenda y generar PDF
  async capturePdfBase64(legend: string): Promise<string> {
    if (!this.htmlIframe || !this.htmlIframe.nativeElement.contentDocument) {
      throw new Error('El Iframe no esta cargado correctamente.');
    }
    
    const doc = this.htmlIframe.nativeElement.contentDocument;
    
    // 1. Limpiar etiquetas vivas
    const htmlString = doc.body.innerHTML;
    let modifiedHtml = htmlString
      .replace(/{{__signature__}}/gi, legend)
      .replace(/{{__attachmen_list__}}/gi, '')
      .replace(/{{__attachmen__}}/gi, '')
      .replace(/{{CCP}}/gi, '')
      .replace(/{{MAKER}}/gi, '');
      
    // Reemplazar de nuevo en el DOM
    doc.body.innerHTML = modifiedHtml;

    // 2. Importar dinamicamente html2pdf para no afectar el bundle inicial
    const html2pdf = (await import('html2pdf.js')).default;
    
    // 3. Opciones de PDF
    const opt = {
      margin:       0,
      filename:     'documento_emergencia.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    // 4. Generar y extraer Base64
    const pdfBase64 = await html2pdf().set(opt).from(doc.body).outputPdf('datauristring');
    
    return pdfBase64.split(',')[1];
  }
}
