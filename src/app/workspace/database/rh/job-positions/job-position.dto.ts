import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';

export enum JobLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export class JobPositionDTO extends BaseDto<JobPositionDTO> implements IBaseEntity {
  id!: string;
  name!: string;
  name_fem?: string;
  name_plural?: string;
  job_key?: string;
  category?: string;
  level?: JobLevel;
  connector?: string;
  job_connector?: string;
  job_connector_fem?: string;
  principal!: boolean;
  active!: boolean;
  index_sort?: number | null;

  constructor(data: any = {}) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.name_fem = data.name_fem || '';
    this.name_plural = data.name_plural || '';
    this.job_key = data.job_key || '';
    this.category = data.category || '';
    this.level = data.level || undefined;
    this.connector = data.connector || '';
    this.job_connector = data.job_connector || '';
    this.job_connector_fem = data.job_connector_fem || '';
    this.principal = data.principal !== undefined ? data.principal : false;
    this.active = data.active !== undefined ? data.active : true;
    this.index_sort = data.index_sort !== undefined ? data.index_sort : null;
  }

  get principalLabel(): string {
    return this.principal ? '⭐ Autoridad' : 'Operativo';
  }

  get activeLabel(): string {
    return this.active ? 'Activo' : 'Inactivo';
  }
}
