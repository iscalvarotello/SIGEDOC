/**
 * Resuelve una ruta anidada dentro de un objeto.
 * Ej: getNestedValue(obj, 'city.state.id')
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/**
 * Aplica un mapeo genérico a un objeto de datos.
 * Útil para aplanar estructuras anidadas que vienen del backend.
 * 
 * @param data El objeto original devuelto por el backend
 * @param mapping Un diccionario donde la clave es el nombre de la propiedad deseada y el valor es un arreglo de rutas de fallback.
 * Ej: { city_id: ['city_id', 'city.id'] }
 */
export function applyFrontendMapping(data: any, mapping: Record<string, string | string[]>): any {
  if (!data || typeof data !== 'object') return data;
  
  const result = { ...data };
  
  for (const [targetKey, paths] of Object.entries(mapping)) {
    // Si ya existe y no es nulo/undefined, mantenemos el valor
    if (result[targetKey] !== undefined && result[targetKey] !== null) continue;
    
    // Normalizamos a array
    const pathArray = Array.isArray(paths) ? paths : [paths];
    
    // Buscamos la propiedad en las rutas de fallback
    for (const path of pathArray) {
      const value = getNestedValue(data, path);
      if (value !== undefined && value !== null) {
        result[targetKey] = value;
        break;
      }
    }
  }
  
  return result;
}
