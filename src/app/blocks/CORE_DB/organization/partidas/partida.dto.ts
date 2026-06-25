export class PartidaDTO {
  id: string;
  partida: string;
  descripcion: string;
  full_name: string;
  active: boolean;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.partida = data.partida || '';
    this.descripcion = data.descripcion || '';
    this.full_name = data.full_name || '';
    this.active = data.active !== undefined ? data.active : true;
  }
}
