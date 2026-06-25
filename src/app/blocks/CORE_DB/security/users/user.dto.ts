export class UserDTO {
  id!: string;
  email!: string;
  backend_role!: string;
  active!: boolean;

  // Empleado y Persona (Estándar en Inglés)
  employee_id?: string | null;
  name?: string | null;
  first_surname?: string | null;
  second_surname?: string | null;

  // Adscripciones (Estándar en Inglés)
  area_id?: string | null;
  area_name?: string | null;
  area_base_id?: string | null;
  area_base_name?: string | null;
  is_head?: boolean | null;
  is_reviewer?: boolean | null;
  is_reception?: boolean | null;
  is_in_charge?: boolean | null;

  // Roles del Sistema (Matriz de Permisos)
  system_role_id?: number | null;
  system_role_name?: string | null;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.backend_role = data.backend_role || 'user';
    this.active = data.active !== undefined ? !!data.active : true;

    // Mapeo plano del backend estandarizado
    this.employee_id = data.employee_id || null;
    this.name = data.name || null;
    this.first_surname = data.first_surname || null;
    this.second_surname = data.second_surname || null;

    this.area_id = data.area_id || null;
    this.area_name = data.area_name || null;
    this.area_base_id = data.area_base_id || null;
    this.area_base_name = data.area_base_name || null;

    this.is_head = data.is_head !== undefined ? !!data.is_head : null;
    this.is_reviewer = data.is_reviewer !== undefined ? !!data.is_reviewer : null;
    this.is_reception = data.is_reception !== undefined ? !!data.is_reception : null;
    this.is_in_charge = data.is_in_charge !== undefined ? !!data.is_in_charge : null;

    this.system_role_id = data.system_role_id !== undefined ? (data.system_role_id ? Number(data.system_role_id) : null) : null;
    this.system_role_name = data.system_role_name || null;
  }

  /**
   * Nombre completo en formato: Nombre ApellidoPaterno ApellidoMaterno
   */
  get fullName(): string {
    if (!this.name && !this.first_surname && !this.second_surname) {
      return 'Sin empleado asociado';
    }
    return `${this.name || ''} ${this.first_surname || ''} ${this.second_surname || ''}`.replace(/\s+/g, ' ').trim();
  }

  /**
   * Etiqueta formateada del rol de backend del usuario
   */
  get backendRoleLabel(): string {
    switch (this.backend_role) {
      case 'superadmin': return 'Superadministrador 👑';
      case 'admin': return 'Administrador 🛡️';
      case 'superuser': return 'Superusuario ⚡';
      case 'user': return 'Usuario Estándar 👤';
      default: return this.backend_role;
    }
  }

  /**
   * Etiqueta formateada del estado activo/inactivo
   */
  get activeLabel(): string {
    return this.active ? 'Activo' : 'Inactivo';
  }

  /**
   * Nombre del rol de sistema asignado (Matriz de Permisos)
   */
  get systemRoleLabel(): string {
    return this.system_role_name || 'Sin rol asignado 👤';
  }

  /**
   * Nombre del área asignada
   */
  get resolvedAreaName(): string {
    return this.area_name || this.area_base_name || 'Sin área asignada';
  }

  /**
   * Etiqueta de roles organizacionales
   */
  get organizationalRolesLabel(): string {
    const roles: string[] = [];
    if (this.is_head) roles.push('Titular 🏛️');
    if (this.is_in_charge) roles.push('Encargado 👑');
    if (this.is_reviewer) roles.push('Revisor 📋');
    if (this.is_reception) roles.push('Recepción 📨');
    return roles.join(', ') || 'Personal Operativo';
  }
}
