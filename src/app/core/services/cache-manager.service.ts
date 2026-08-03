import { Injectable } from '@angular/core';

export interface CacheEntry {
  data: any;
  expiresAt: number | null; // Timestamp en milisegundos. null = infinito.
}

import { APP_SETTINGS } from '@metasystem/settings/app.settings';

@Injectable({
  providedIn: 'root'
})
export class CacheManagerService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_PREFIX = APP_SETTINGS.SYSTEM_SHORT_NAME.toUpperCase() + '_CACHE_';

  /**
   * Obtiene un valor del localStorage si existe y no ha expirado.
   */
  get(baseKey: string, params?: Record<string, any>): any | null {
    const key = this.buildCacheKey(baseKey, params);
    const raw = localStorage.getItem(key);
    
    if (!raw) return null;
    
    try {
      const entry: CacheEntry = JSON.parse(raw);
      
      if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
        console.log(`[Cache EXPIRED] 🕰️ ${key} ha caducado.`);
        this.delete(key);
        return null;
      }
      
      console.log(`[Cache HIT] 🚀 ${key} recuperado de localStorage.`);
      return entry.data;
    } catch (e) {
      console.error(`Error parseando caché para ${key}:`, e);
      this.delete(key);
      return null;
    }
  }

  /**
   * Guarda un valor en el localStorage con un TTL opcional (en minutos).
   */
  set(baseKey: string, params: Record<string, any> | undefined, data: any, ttlMinutes?: number): void {
    const key = this.buildCacheKey(baseKey, params);
    const expiresAt = ttlMinutes ? Date.now() + (ttlMinutes * 60 * 1000) : null;
    
    const entry: CacheEntry = { data, expiresAt };
    
    try {
      localStorage.setItem(key, JSON.stringify(entry));
      console.log(`[Cache SET] 💾 ${key} guardado en localStorage.`);
    } catch (e) {
      console.warn('LocalStorage está lleno o bloqueado. Limpiando caché...', e);
      // Si el localStorage está lleno, limpiamos todo nuestro caché e intentamos de nuevo
      this.clearAll();
      try {
         localStorage.setItem(key, JSON.stringify(entry));
      } catch(e2) {
         console.error('Imposible guardar en localStorage.', e2);
      }
    }
  }

  /**
   * Elimina una llave específica (interna).
   */
  private delete(exactKey: string): void {
    localStorage.removeItem(exactKey);
  }

  /**
   * Invalida (limpia) todas las llaves que comiencen con una baseKey.
   * Útil para cuando se modifica un catálogo (ej. se crea un País, destruimos todo COUNTRIES)
   */
  invalidateByBaseKey(baseKey: string): void {
    const prefix = `${this.CACHE_PREFIX}${baseKey}`;
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    
    keysToRemove.forEach(k => localStorage.removeItem(k));
    if (keysToRemove.length > 0) {
      console.log(`[Cache INVALIDATED] 💥 Se destruyeron ${keysToRemove.length} llaves relacionadas a ${baseKey}.`);
    }
  }

  /**
   * Limpia ABSOLUTAMENTE todo el caché gestionado por este servicio.
   */
  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(this.CACHE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    console.log(`[Cache CLEARED] 🧹 Caché global purgado.`);
  }

  /**
   * Construye la llave combinada y determinista.
   */
  private buildCacheKey(baseKey: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return `${this.CACHE_PREFIX}${baseKey}`;
    }
    
    // Serializamos de manera determinista (alfabética)
    const sortedKeys = Object.keys(params).sort();
    const paramsStr = sortedKeys
      .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '') // Ignorar vacíos
      .map(k => `${k}=${params[k]}`)
      .join('|');
      
    // Si todos los parámetros estaban vacíos, regresamos solo la baseKey
    if (!paramsStr) {
        return `${this.CACHE_PREFIX}${baseKey}`;
    }
      
    return `${this.CACHE_PREFIX}${baseKey}::[${paramsStr}]`;
  }
}
