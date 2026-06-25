import { FormGroup } from '@angular/forms';

export class FormErrorParser {
  
  /**
   * Intenta mapear los errores del Backend al FormGroup.
   * Retorna un arreglo con los mensajes de error que NO pudieron ser mapeados a ningún campo,
   * para que el controlador los muestre como una alerta general.
   */
  static parse(errorResponse: any, form: FormGroup): string[] {
    const unmappedErrors: string[] = [];
    
    // Si no es un error de HTTP clásico con payload .error
    if (!errorResponse || !errorResponse.error) {
      unmappedErrors.push(errorResponse?.message || 'Error inesperado de red. Revisa tu conexión.');
      return unmappedErrors;
    }

    const payload = errorResponse.error;
    const messages = payload.message;

    // Si no hay mensaje, devolvemos fallback
    if (!messages) {
      unmappedErrors.push(payload.error || 'Error interno del servidor.');
      return unmappedErrors;
    }

    // 1. Si es un arreglo (ej. NestJS class-validator)
    if (Array.isArray(messages)) {
      messages.forEach(msg => {
        if (typeof msg === 'string') {
          // Asumimos que la primera palabra es el campo (ej: "iso2 must be shorter than 2")
          const fieldName = msg.split(' ')[0];
          
          if (form.contains(fieldName)) {
            // Lo inyectamos en el control. Quitamos el nombre del campo para no ser redundantes en la UI.
            const cleanMsg = msg.replace(fieldName, '').trim();
            form.get(fieldName)?.setErrors({ serverError: cleanMsg });
          } else {
            // El campo no existe en el formulario, se va al alert general
            unmappedErrors.push(msg);
          }
        }
      });
    } 
    // 2. Si es un string único (ej. Error de Base de Datos lanzado a mano: "Key (iso2)=(US) already exists.")
    else if (typeof messages === 'string') {
      const dbMatch = this.extractPostgresField(messages);
      
      if (dbMatch && form.contains(dbMatch.field)) {
        form.get(dbMatch.field)?.setErrors({ serverError: 'Este valor ya existe en la base de datos.' });
      } else {
        unmappedErrors.push(messages);
      }
    }

    return unmappedErrors;
  }

  /**
   * Intenta extraer el nombre del campo de un error de Postgres `error.detail`
   * Ejemplo: "Key (iso2)=(US) already exists." -> retorna { field: 'iso2' }
   */
  private static extractPostgresField(message: string): { field: string } | null {
    const match = message.match(/Key \((.*?)\)=/);
    if (match && match[1]) {
      return { field: match[1] };
    }
    return null;
  }
}
