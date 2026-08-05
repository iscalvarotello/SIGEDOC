export enum EntityType {
  OFICIAL = 'oficial',
  PARTICULAR = 'particular'
}

export enum GovernmentLevel {
  FEDERAL = 'federal',
  ESTATAL = 'estatal',
  MUNICIPAL = 'municipal',
  NINGUNO = 'n/a'
}

export interface ExternalContactDTO {
  id: string;
  nombre: string;
  puesto?: string;
  empresa_dependencia?: string;
  tipo_entidad: EntityType;
  nivel_gobierno: GovernmentLevel;
  telefono?: string;
  email?: string;
  curp?: string;
}
