import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    const dynamicImportFailedMessage = /Failed to fetch dynamically imported module/;

    if (
      chunkFailedMessage.test(error.message) ||
      dynamicImportFailedMessage.test(error.message)
    ) {
      console.warn('Detectado error de carga de chunk (versión desactualizada). Recargando página para obtener los nuevos recursos...');
      window.location.reload();
    } else {
      console.error('Error no controlado interceptado por GlobalErrorHandler:', error);
    }
  }
}
