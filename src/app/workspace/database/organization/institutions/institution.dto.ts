import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export enum InstitutionLevel {
  Municipal = 'Municipal',
  Estatal = 'Estatal',
  Federal = 'Federal',
  Privado = 'Privado'
}

export class InstitutionDTO extends BaseDto<InstitutionDTO> implements IBaseEntity {
  id: string;
  name: string;
  acronym: string;
  level: InstitutionLevel;
  logo: string | null;
  escudo: string | null;
  back: string | null;
  footer: string | null;
  main_branch_id: string | null;
  main_branch?: any;
  branches?: any[];

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.acronym = data.acronym || '';
    this.level = data.level || InstitutionLevel.Estatal;
    this.logo = data.logo || null;
    this.escudo = data.escudo || null;
    this.back = data.back || null;
    this.footer = data.footer || null;
    this.main_branch_id = data.main_branch_id || null;
    this.main_branch = data.main_branch || null;
    this.branches = data.branches || [];
  }
}
