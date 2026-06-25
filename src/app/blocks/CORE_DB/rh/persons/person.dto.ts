export class PersonDTO {
  id!: string;
  prefix!: string;
  name!: string;
  first_surname!: string;
  second_surname?: string;
  birth_date?: string;
  curp?: string;
  rfc?: string;
  sex?: string;
  phone?: string;
  email?: string;
  nickname?: string;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.prefix = data.prefix || 'Lic.';
    this.name = data.name || '';
    this.first_surname = data.first_surname || '';
    this.second_surname = data.second_surname || '';
    this.birth_date = data.birth_date || '';
    this.curp = data.curp || '';
    this.rfc = data.rfc || '';
    this.sex = data.sex || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.nickname = data.nickname || '';
  }

  get fullName(): string {
    const parts = [
      this.prefix,
      this.name,
      this.first_surname,
      this.second_surname
    ].filter(p => !!p);
    return parts.join(' ');
  }

  get sexLabel(): string {
    if (this.sex === 'H') return 'Hombre';
    if (this.sex === 'M') return 'Mujer';
    return 'N/A';
  }
}
