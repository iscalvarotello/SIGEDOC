// types/documento.interface.ts
export type TipoDocumentoId = 1 | 2 | 3 | 4;
export type OrigenDocumento = 'directo' | 'gestionado';

export interface TipoDocumento {
  id: TipoDocumentoId;
  label: string;
  slug: string; // Para rutas o lógica interna
  icon: string; // Clases de Heroicons o Lucide
}