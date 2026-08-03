/**
 * Extrae la extensión válida de un nombre de archivo.
 * Escanea de derecha a izquierda buscando un segmento de 2 a 5 caracteres alfanuméricos.
 * Retorna la extensión en minúsculas sin el punto, o un string vacío si no encuentra una válida.
 * 
 * @param filenameOrExt Nombre del archivo o extensión a evaluar.
 * @returns Extensión válida (ej. 'pdf', 'docx') o string vacío.
 */
export function extractFileExtension(filenameOrExt: string): string {
  const name = (filenameOrExt || '').trim().toLowerCase();
  if (!name) return '';
  
  // Si la cadena no tiene puntos y es muy corta (ej 'pdf', 'docx'), podría ser la extensión pura
  if (!name.includes('.') && name.length <= 5 && /^[a-z0-9]+$/.test(name)) {
    return name;
  }

  if (name.includes('.')) {
    // Separar por puntos y evaluar de derecha a izquierda (desde el final hacia el inicio)
    const parts = name.split('.');
    for (let i = parts.length - 1; i >= 1; i--) {
      const possibleExt = parts[i].trim();
      // Validar que la supuesta extensión tenga sentido (2 a 5 letras/números, sin espacios)
      if (possibleExt.length >= 2 && possibleExt.length <= 5 && /^[a-z0-9]+$/.test(possibleExt)) {
        return possibleExt; // Retornamos el primer segmento válido que encontremos
      }
    }
  }
  
  return '';
}
