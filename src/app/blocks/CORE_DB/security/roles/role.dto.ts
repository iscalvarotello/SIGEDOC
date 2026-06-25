export class RoleDTO {
  id: number;
  name: string;
  description: string;

  constructor(data: any = {}) {
    this.id = data.id !== undefined ? Number(data.id) : 0;
    this.name = data.name || '';
    this.description = data.description || '';
  }
}
