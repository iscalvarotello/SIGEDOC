export class ProjectDTO {
  id: string;
  name: string;
  code: string;
  CP: string;
  CA: string;
  FU: string;
  SF: string;
  AI: string;
  PT: string;
  oficial_name: string;
  type: 'de Inversión' | 'Institucional';
  active: boolean;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.code = data.code || '';
    this.CP = data.CP || '';
    this.CA = data.CA || '';
    this.FU = data.FU || '';
    this.SF = data.SF || '';
    this.AI = data.AI || '';
    this.PT = data.PT || '';
    this.oficial_name = data.oficial_name || '';
    this.type = data.type || 'Institucional';
    this.active = data.active !== undefined ? data.active : true;
  }
}
