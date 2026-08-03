/**
 * Normaliza una cadena de texto:
 * 1. Quita espacios en blanco al inicio y final.
 * 2. Convierte todo a mayúsculas (o minúsculas si se prefiere).
 * 3. Remueve acentos y marcas diacríticas (ej. á -> a, ñ -> n).
 */
export function normalizeString(str: string | null | undefined): string {
  if (!str) return '';
  
  return str
    .trim()
    .toUpperCase()
    // Utiliza Normalization Form Canonical Decomposition (NFD) para separar letras de acentos
    .normalize('NFD')
    // Remueve los caracteres de marcas diacríticas (acentos)
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Compara dos cadenas de texto de manera insensible a mayúsculas, minúsculas y acentos.
 * @param a Primera cadena
 * @param b Segunda cadena
 * @returns true si son equivalentes
 */
export function compareStrings(a: string | null | undefined, b: string | null | undefined): boolean {
  return normalizeString(a) === normalizeString(b);
}
