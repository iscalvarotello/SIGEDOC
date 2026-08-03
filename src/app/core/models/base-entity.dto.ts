export interface IBaseEntity {
  id?: string | number;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  created_by?: string | null;
  updated_by?: string | null;
  institution_id?: string | null;
}

export type BasePayload<T> = Omit<T, keyof IBaseEntity>;

export abstract class BaseDto<T> {
  toPayload(): BasePayload<T> {
    // Extraemos los campos comunes para no mandarlos en el payload
    const { 
      id, created_at, updated_at, created_by, updated_by, institution_id, 
      ...payload 
    } = this as any;
    
    // Devolvemos el resto de la data limpia
    return payload;
  }
}
