import { Component, input, output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';
import { SafeResourceUrl, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-viewer',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './html-viewer.component.html',
  host: { class: 'flex flex-col flex-1 h-full min-h-0' }
})
export class HtmlViewerComponent {
  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  htmlUrl = input<SafeResourceUrl | null>(null);
  htmlContent = input<SafeHtml | string | null>(null);
  isLoading = input<boolean>(false);
  showCloseButton = input<boolean>(true);
  showRenderButton = input<boolean>(false);
  showAutographSignature = input<boolean>(false);
  
  showDigitalSignature = input<boolean>(false);
  replacements = input<Record<string, string>>({});


  // Outputs
  closeClick = output<void>();
  onRender = output<void>();
  onSignDigital = output<void>();
  onSignAutograph = output<void>();

  @ViewChild('htmlIframe', { static: false }) htmlIframe!: ElementRef<HTMLIFrameElement>;

  onIframeLoad() {
    if (!this.htmlIframe || !this.htmlIframe.nativeElement.contentDocument) return;
    const doc = this.htmlIframe.nativeElement.contentDocument;
    
    const dict = this.replacements();
    if (Object.keys(dict).length === 0) return;
    
    let hasChanges = false;
    let html = doc.body.innerHTML;
    
    for (const [key, value] of Object.entries(dict)) {
      if (value !== undefined && value !== null) {
        // Find tags inside data-var spans
        const spans = doc.querySelectorAll(`[data-var="{{${key}}}"]`);
        spans.forEach(span => {
          if (span.innerHTML !== value) {
            span.innerHTML = value;
            hasChanges = true;
          }
        });
        
        // Also replace raw tags if they exist anywhere else
        if (html.includes(`{{${key}}}`)) {
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      // Re-apply the raw tag replacements
      for (const [key, value] of Object.entries(dict)) {
         if (value !== undefined && value !== null) {
           const regex = new RegExp(`\\{\\{${key}\\\}\\}`, 'g');
           html = html.replace(regex, value);
         }
      }
      doc.body.innerHTML = html;
    }
  }

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
    handleRenderClick() {
    if (!this.htmlIframe || !this.htmlIframe.nativeElement.contentDocument) return;
    const doc = this.htmlIframe.nativeElement.contentDocument;
    
    // Primero sencillo: solo textos simples
    const signatureMock = '';
    const ccpMock = '';
    const makerMock = '';

    let html = doc.body.innerHTML;
    
    html = html
      .replace(/{{__signature__}}/gi, signatureMock)
      .replace(/{{__attachmen_list__}}/gi, '')
      .replace(/{{__attachmen__}}/gi, '')
      .replace(/{{CCP}}/gi, ccpMock)
      .replace(/{{MAKER}}/gi, makerMock);
      
    doc.body.innerHTML = html;
    this.onRender.emit();
  }

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





