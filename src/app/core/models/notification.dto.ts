export class NotificationDTO {
  id!: string;
  titulo!: string;
  mensaje!: string;
  path!: string;
  query_params!: any;
  leido!: boolean;
  read_at!: Date | null;
  created_at!: Date;
  remitente!: {
    id: string;
    person: {
      name: string;
      first_surname: string;
      second_surname?: string;
    };
  } | null;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.titulo = data.titulo || '';
    this.mensaje = data.mensaje || '';
    this.path = data.path || '';
    this.leido = !!data.leido;
    this.read_at = data.read_at ? new Date(data.read_at) : null;
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.remitente = data.remitente || null;

    if (typeof data.query_params === 'string') {
      try {
        this.query_params = JSON.parse(data.query_params);
      } catch (e) {
        this.query_params = {};
      }
    } else {
      this.query_params = data.query_params || {};
    }
  }

  get senderName(): string {
    if (!this.remitente || !this.remitente.person) {
      return 'Sistema';
    }
    const name = this.remitente.person.name || '';
    const first = this.remitente.person.first_surname || '';
    const second = this.remitente.person.second_surname || '';
    return `${name} ${first} ${second}`.replace(/\s+/g, ' ').trim();
  }

  get timeAgo(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.created_at.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    // Evitar que devuelva 'hace -1 minutos' si hay ligeros desfases de reloj del servidor
    if (diffSec < 0) {
      return 'hace unos momentos';
    }

    if (diffSec < 60) {
      return 'hace unos momentos';
    } else if (diffMin < 60) {
      return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHr < 24) {
      return `hace ${diffHr} ${diffHr === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 30) {
      return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      const d = this.created_at.getDate();
      const m = this.created_at.getMonth() + 1;
      const y = this.created_at.getFullYear();
      return `el ${d}/${m}/${y}`;
    }
  }
}
